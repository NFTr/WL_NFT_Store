<?php

namespace App\Service;

use App\Entity\Offer;
use App\Repository\NftRepository;
use App\Repository\OfferRepository;
use App\Utilities\PuzzleHashConverter;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DexieOfferAdapter implements OfferAdapter
{
    private HttpClientInterface $client;
    private LoggerInterface $logger;
    private OfferRepository $offerRepository;
    private NftRepository $nftRepository;
    private EntityManagerInterface $entityManager;
    private PuzzleHashConverter $puzzleHashConverter;

    private string $baseUrl;

    public function __construct(string $baseUrl, HttpClientInterface $client, LoggerInterface $logger, OfferRepository $offerRepository, NftRepository $nftRepository, EntityManagerInterface $entityManager, PuzzleHashConverter $puzzleHashConverter)
    {
        $this->baseUrl = $baseUrl;

        $this->client = $client;
        $this->logger = $logger;
        $this->offerRepository = $offerRepository;
        $this->entityManager = $entityManager;
        $this->nftRepository = $nftRepository;
        $this->puzzleHashConverter = $puzzleHashConverter;
    }


    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    function importOffersByCollection(string $collectionId): void
    {
        $this->entityManager->getConnection()->getConfiguration()->setSQLLogger(null);
        $this->logger->info("Fetching offers from collection $collectionId");
        $this->importAllOfferPages("$this->baseUrl/offers?offered=$collectionId&requested=xch&count=100&status=0&status=3&status=4");
        $this->importAllOfferPages("$this->baseUrl/offers?offered=xch&requested=$collectionId&count=100&status=0&status=3&status=4");
    }


    /**
     * @param string $url
     * @return void
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function importAllOfferPages(string $url): void
    {
        $page = 1;
        while (true) {
            $response = $this->client->request('GET', "$url&page=$page");
            $JsonResponse = json_decode($response->getContent());
            $offersToImport = $JsonResponse->offers;
            $page += 1;
            if (sizeof($offersToImport) == 0) {
                break;
            }
            foreach ($offersToImport as $offerToImport) {
                $this->importOffer($offerToImport);
            }
            $this->entityManager->flush();
            $this->entityManager->clear();

            // Sleep for 500ms to not run into rate limiting
            usleep(500000);
        }
    }

    public function importOffer(mixed $offerToImport): void
    {
        $this->logger->info("Importing offer $offerToImport->id");
        $offer = $this->offerRepository->find($offerToImport->id);
        $is_new = $offer == null;

        $offer = $this->convertAndUpdateOffer($offer, $offerToImport);

        if ($is_new) {
            foreach ($offer->getOffered() as $item) {
                $this->addPriceAndNftRelationship(Offer::SIDE_OFFERED, $item, $offer);
            }
            foreach ($offer->getRequested() as $item) {
                $this->addPriceAndNftRelationship(Offer::SIDE_REQUESTED, $item, $offer);
            }
        }
        $this->offerRepository->save($offer);
    }

    private function convertAndUpdateOffer(?Offer $offer, mixed $offerToImport): Offer
    {
        $offerId = trim($offerToImport->id);
        if (!$offer) {
            $offer = new Offer();
            $offer->setId($offerId);
            $offer->setDateFound(DateTime::createFromFormat('Y-m-d\TH:i:s.v\Z', $offerToImport->date_found));
            $offer->setOffered($this->cleanUpOfferedRequested($offerToImport->offered));
            $offer->setRequested($this->cleanUpOfferedRequested($offerToImport->requested));
            $offer->setOfferstring($offerToImport->offer);
            $offer->setSource('dexie');
        }

        $offer->setStatus($offerToImport->status);
        if ($offerToImport->date_completed) {
            $offer->setDateCompleted(DateTime::createFromFormat('Y-m-d\TH:i:s.v\Z', $offerToImport->date_completed));
        }

        return $offer;
    }

    private function cleanUpOfferedRequested(array $offeredRequested): array
    {
        $cleanup = function (mixed $value): array {
            if (property_exists($value, 'is_nft')) {
                return ['id' => $this->puzzleHashConverter->encodePuzzleHash($value->id, 'nft'), 'amount' => 1];
            }
            return (array) $value;
        };
        return array_map($cleanup, $offeredRequested);
    }

    /**
     * @param mixed $item
     * @param Offer $offer
     */
    private function addPriceAndNftRelationship(int $side, mixed $item, Offer $offer): void
    {
        if (str_starts_with($item['id'], 'nft1')) {
            $offer->setSide($side);
            $nft = $this->nftRepository->find($item['id']);
            if ($nft) {
                $offer->addNft($nft);
            }
        } else if ($item['id'] == 'xch') {
            $offer->setXchPrice($item['amount']);
        }
    }
}