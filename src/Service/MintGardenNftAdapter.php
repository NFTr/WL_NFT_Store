<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\Did;
use App\Entity\NftEvent;
use App\Repository\AddressRepository;
use App\Repository\DidRepository;
use App\Repository\NftCollectionRepository;
use App\Repository\NftEventRepository;
use App\Repository\NftRepository;
use App\Utilities\PuzzleHashConverter;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MintGardenNftAdapter implements NftAdapter
{
    private HttpClientInterface $client;
    private LoggerInterface $logger;
    private NftRepository $nftRepository;
    private NftEventRepository $nftEventRepository;
    private DidRepository $didRepository;
    private AddressRepository $addressRepository;
    private NftCollectionRepository $collectionRepository;
    private PuzzleHashConverter $puzzleHashConverter;
    private EntityManagerInterface $entityManager;

    private string $baseUrl;

    public function __construct(
        string $baseUrl,
        HttpClientInterface $client,
        LoggerInterface $logger,
        NftRepository $nftRepository,
        NftEventRepository $nftEventRepository,
        DidRepository $didRepository,
        AddressRepository $addressRepository,
        NftCollectionRepository $collectionRepository,
        PuzzleHashConverter $puzzleHashConverter,
        EntityManagerInterface $entityManager
    ) {
        $this->baseUrl = $baseUrl;

        $this->client = $client;
        $this->logger = $logger;
        $this->nftRepository = $nftRepository;
        $this->nftEventRepository = $nftEventRepository;
        $this->addressRepository = $addressRepository;
        $this->didRepository = $didRepository;
        $this->collectionRepository = $collectionRepository;
        $this->puzzleHashConverter = $puzzleHashConverter;
        $this->entityManager = $entityManager;
    }

    function importNftsByProfile(string $profileId): array
    {
        return [];
    }

    function importNftsByCollection(string $collectionId): void
    {

    }

    public function importNftProvenanceForAllNfts(): void
    {
        $nfts = $this->nftRepository->findAll();
        foreach ($nfts as $nft) {
            $id = $nft->getId();
            $existingEvents = $nft->getEvents();

            $response = $this->client->request(
                'GET',
                "$this->baseUrl/nfts/$id"
            );
            $JsonResponse = json_decode($response->getContent());
            $mintgardenNft = $JsonResponse;
            foreach ($mintgardenNft->events as $mintgardenEvent) {
                $event = new NftEvent();
                $event->setType($this->convertEvent($mintgardenEvent->type));
                $event->setTimestamp(DateTime::createFromFormat('Y-m-d\TH:i:sP', $mintgardenEvent->timestamp));
                $event->setEventIndex($mintgardenEvent->event_index);
                $event->setXchPrice($mintgardenEvent->xch_price);

                if ($mintgardenEvent->owner) {
                    $owner = $this->getOrCreateDid($mintgardenEvent->owner->id);
                    $event->setOwner($owner);
                }
                if ($mintgardenEvent->address) {
                    $address = $this->getOrCreateAddress($mintgardenEvent->address->id);
                    $event->setAddress($address);
                }

                if (!in_array($event, array_column($existingEvents->toArray(), 'id'))) {
                    $event->setNft($nft);
                    $this->entityManager->persist($event);
                }
            }

            // Sleep for 500ms to not run into rate limiting
            usleep(50000);
        }
    }

    private function convertEvent(int $event): string
    {
        if ($event == 0) {
            return 'mint';
        } elseif ($event == 1) {
            return 'transfer';
        } elseif ($event == 2) {
            return 'trade';
        } elseif ($event == 3) {
            return 'burn';
        }

        return 'unknown';
    }


    /**
     * @param string $didId
     * @return Did
     */
    private function getOrCreateDid(string $didId): Did
    {
        $did = $this->didRepository->find($didId);
        if (!$did) {
            $did = new Did();
            $did->setId($didId);
            $did->setEncodedId(
                $this->puzzleHashConverter->encodePuzzleHash($didId, 'did:chia:')
            );
            $this->didRepository->save($did);
        }

        return $did;
    }

    /**
     * @param string $puzzleHash
     * @return Address
     */
    private function getOrCreateAddress(string $puzzleHash): Address
    {
        $address = $this->addressRepository->find($puzzleHash);
        if (!$address) {
            $address = new Address();
            $address->setId($puzzleHash);
            $address->setEncodedAddress(
                $this->puzzleHashConverter->encodePuzzleHash($puzzleHash)
            );
            $this->addressRepository->save($address);
        }

        return $address;
    }
}