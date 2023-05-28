<?php

namespace App\Service;

use App\Entity\Offer;
use App\Repository\DidRepository;
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
    private DidRepository $didRepository;
    private EntityManagerInterface $entityManager;
    private PuzzleHashConverter $puzzleHashConverter;

    private string $baseUrl;

    public function __construct(
        string $baseUrl,
        HttpClientInterface $client,
        LoggerInterface $logger,
        OfferRepository $offerRepository,
        NftRepository $nftRepository,
        DidRepository $didRepository,
        EntityManagerInterface $entityManager,
        PuzzleHashConverter $puzzleHashConverter
    ) {
        $this->baseUrl = $baseUrl;

        $this->client = $client;
        $this->logger = $logger;
        $this->offerRepository = $offerRepository;
        $this->entityManager = $entityManager;
        $this->nftRepository = $nftRepository;
        $this->didRepository = $didRepository;
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
        $this->importCollectionOffersSinceLastKnownOffer($collectionId, Offer::SIDE_OFFERED, [0]);
        $this->importCollectionOffersSinceLastKnownOffer($collectionId, Offer::SIDE_REQUESTED, [0]);
        $this->importCollectionOffersSinceLastKnownOffer($collectionId, Offer::SIDE_OFFERED, [3, 4]);
        $this->importCollectionOffersSinceLastKnownOffer($collectionId, Offer::SIDE_REQUESTED, [3, 4]);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    function importOffersByProfile(string $profileId): void
    {
        $this->entityManager->getConnection()->getConfiguration()->setSQLLogger(null);
        $this->logger->info("Fetching offers from profile $profileId");
        $profile = $this->didRepository->find($profileId);
        $createdNfts = $this->nftRepository->findBy(["creator" => $profile]);
        $ownedNfts = $this->nftRepository->findBy(["owner" => $profile]);
        foreach (array_merge($createdNfts, $ownedNfts) as $nft) {
            $this->importNftOffersSinceLastKnownOffer($nft->getId(), Offer::SIDE_OFFERED, [0]);
            $this->importNftOffersSinceLastKnownOffer($nft->getId(), Offer::SIDE_REQUESTED, [0]);
            $this->importNftOffersSinceLastKnownOffer($nft->getId(), Offer::SIDE_OFFERED, [3, 4]);
            $this->importNftOffersSinceLastKnownOffer($nft->getId(), Offer::SIDE_REQUESTED, [3, 4]);

            // Sleep for 1s to not run into rate limiting
            usleep(1000000);
        }
    }


    /**
     * @param string $nftId
     * @param int $side
     * @param array $statuses
     * @return void
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function importNftOffersSinceLastKnownOffer(string $nftId, int $side, array $statuses): void
    {
        $isStatusOpen = $statuses[0] == 0;
        $newestOffer = $this->offerRepository->findNewestOfferForNft(
            $nftId,
            $isStatusOpen ? 'dateFound' : 'dateCompleted'
        );

        $this->importOffersSinceLastKnownOffer($nftId, $side, $newestOffer, $statuses);
    }

    /**
     * @param string $collectionId
     * @param int $side
     * @param array $statuses
     * @return void
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function importCollectionOffersSinceLastKnownOffer(string $collectionId, int $side, array $statuses): void
    {
        $isStatusOpen = $statuses[0] == 0;
        $newestOffer = $this->offerRepository->findNewestOfferForCollection(
            $collectionId,
            $isStatusOpen ? 'dateFound' : 'dateCompleted'
        );

        $this->importOffersSinceLastKnownOffer($collectionId, $side, $newestOffer, $statuses);
    }

    /**
     * @param string $collectionId
     * @param int $side
     * @param array $statuses
     * @return void
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function importOffersSinceLastKnownOffer(string $id, int $side, ?Offer $newestOffer, array $statuses): void
    {
        $isStatusOpen = $statuses[0] == 0;

        $date = $isStatusOpen ? $newestOffer?->getDateFound() : $newestOffer?->getDateCompleted();
        $sort = $isStatusOpen ? 'date_found' : "date_completed";

        $offered = $side == Offer::SIDE_OFFERED ? $id : 'xch';
        $requested = $side == Offer::SIDE_REQUESTED ? $id : 'xch';

        $status = join("&status=", $statuses);
        $url = "$this->baseUrl/offers?offered=$offered&requested=$requested&count=100&sort=$sort&status=$status";

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
                $offer = $this->importOffer($offerToImport);
                if ($newestOffer) {
                    if ($isStatusOpen && $offer->getDateFound() < $date) {
                        $this->entityManager->flush();
                        return;
                    }
                    if (!$isStatusOpen && $offer->getDateCompleted() < $date) {
                        $this->entityManager->flush();
                        return;
                    }
                }
            }
            $this->entityManager->flush();
            $this->entityManager->clear();

            // Sleep for 500ms to not run into rate limiting
            usleep(500000);
        }
    }

    public function importOffer(mixed $offerToImport): Offer
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

        return $offer;
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
            $nfts = $offer->getNfts();
            foreach ($nfts as $nft) {
                if ($nft->getLowestSellOffer()?->getId() == $offer->getId()) {
                    $nft->setLowestSellOffer($this->offerRepository->findLowestSellOfferForNft($nft));
                }
            }
        }

        return $offer;
    }

    private function cleanUpOfferedRequested(array $offeredRequested): array
    {
        $cleanup = function (mixed $value): array {
            if (property_exists($value, 'is_nft')) {
                return ['id' => $this->puzzleHashConverter->encodePuzzleHash($value->id, 'nft'), 'amount' => 1];
            }

            return (array)$value;
        };

        return array_map($cleanup, $offeredRequested);
    }

    /**
     * @param int $side
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
                if ($offer->getSide() == Offer::SIDE_OFFERED && $offer->getStatus() == 0 && (!$nft->getLowestSellOffer(
                        ) || $nft->getLowestSellOffer()->getXchPrice() > $offer->getXchPrice())) {
                    $nft->setLowestSellOffer($offer);
                }
            }
        } else {
            if ($item['id'] == 'xch') {
                $offer->setXchPrice($item['amount']);
            }
        }
    }
}