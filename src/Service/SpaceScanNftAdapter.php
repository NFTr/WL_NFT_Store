<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\Did;
use App\Entity\Nft;
use App\Entity\NftCollection;
use App\Repository\AddressRepository;
use App\Repository\DidRepository;
use App\Repository\NftCollectionRepository;
use App\Repository\NftRepository;
use App\Utilities\PuzzleHashConverter;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SpaceScanNftAdapter implements NftAdapter
{
    private HttpClientInterface $client;
    private LoggerInterface $logger;
    private NftRepository $nftRepository;
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
        $this->addressRepository = $addressRepository;
        $this->didRepository = $didRepository;
        $this->collectionRepository = $collectionRepository;
        $this->puzzleHashConverter = $puzzleHashConverter;
        $this->entityManager = $entityManager;
    }

    /**
     * @return Nft[]
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    function importNftsByProfile(string $profileId): array
    {
        $this->logger->info("Fetching NFTs created or owned by profile $profileId");
        $nfts = [];
        $page = 1;
        while (true) {
            $response = $this->client->request(
                'GET',
                "$this->baseUrl/1/xch/did/$profileId?page=$page&count=100&type=null"
            );
            $JsonResponse = json_decode($response->getContent());
            $nftsToImport = array_merge($JsonResponse->created, $JsonResponse->owned);
            $page += 1;
            if (sizeof($nftsToImport) == 0) {
                break;
            }

            $profile = $this->didRepository->find($profileId);
            if (!$profile) {
                $profile = new Did();
                $profile->setId($profileId);
                $profile->setEncodedId($this->puzzleHashConverter->encodePuzzleHash($profileId, 'did:chia:'));
                $this->didRepository->save($profile);
            }

            foreach ($nftsToImport as $nftToImport) {
                $this->logger->info("Importing NFT $nftToImport->nft_id");
                $nft = $this->nftRepository->find($nftToImport->nft_id);

                $nft = $this->convertAndUpdateNft($nft, $nftToImport);

                $this->setMinterAddressAndDid($nftToImport, $nft);
                $this->setOwnerAddressAndDid($nftToImport, $nft);
                $this->setCollection($nftToImport, $nft, true);

                $this->nftRepository->save($nft, true);
                $nfts[] = $nft;
            }
        }

        return $nfts;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    function importNftsByCollection(string $collectionId): void
    {
        $this->entityManager->getConnection()->getConfiguration()->setSQLLogger(null);
        $this->logger->info("Fetching NFTs from collection $collectionId");
        $page = 1;
        while (true) {
            $response = $this->client->request(
                'GET',
                "$this->baseUrl/api/nft/collection/$collectionId?coin=xch&version=1&page=$page&count=100"
            );
            $JsonResponse = json_decode($response->getContent());
            $nftsToImport = $JsonResponse->data;
            $page += 1;
            if (sizeof($nftsToImport) == 0) {
                break;
            }
            foreach ($nftsToImport as $nftToImport) {
                $this->logger->info("Importing NFT $nftToImport->nft_id");
                $nft = $this->nftRepository->find($nftToImport->nft_id);

                $nft = $this->convertAndUpdateNft($nft, $nftToImport);

                $this->setMinterAddressAndDid($nftToImport, $nft);
                $this->setOwnerAddressAndDid($nftToImport, $nft);
                $this->setCollection($nftToImport, $nft, false);

                $this->nftRepository->save($nft);
            }
            $this->entityManager->flush();
            $this->entityManager->clear();
        }
    }

    private function convertAndUpdateNft(?Nft $nft, mixed $nftToImport): Nft
    {
        $nftId = trim($nftToImport->nft_id);
        if (!$nft) {
            $nft = new Nft();
            $nft->setId($nftId);
            $nft->setLauncherId(str_replace('0x', '', $nftToImport->nft_info->launcher_id));
            $nft->setRoyaltyPercentage($nftToImport->nft_info->royalty_percentage);
            $nft->setRoyaltyAddress(
                $this->puzzleHashConverter->encodePuzzleHash($nftToImport->nft_info->royalty_puzzle_hash)
            );

            $nft->setMintHeight($nftToImport->nft_info->mint_height);
            if (property_exists($nftToImport->nft_info, 'edition_number')
                && property_exists($nftToImport->nft_info, 'edition_total')) {
                $nft->setEditionNumber($nftToImport->nft_info->edition_number);
                $nft->setEditionTotal($nftToImport->nft_info->edition_total);
            }
        }

        $nft->setThumbnailUri("https://assets.spacescan.io/xch/img/nft/th/$nftId.webp");
        $nft->setPreviewUri("https://assets.spacescan.io/xch/img/nft/full/$nftId.webp");
        $nft->setDataHash($nftToImport->nft_info->data_hash);
        $nft->setDataUris($nftToImport->nft_info->data_uris);
        $nft->setMetaHash($nftToImport->nft_info->metadata_hash);
        $nft->setMetaUris($nftToImport->nft_info->metadata_uris);
        $nft->setLicenseHash($nftToImport->nft_info->license_hash);
        $nft->setLicenseUris($nftToImport->nft_info->license_uris);

        if ($nftToImport->meta_info) {
            if (property_exists($nftToImport->meta_info, 'name')) {
                $nft->setName($nftToImport->meta_info->name);
            }
            if (property_exists($nftToImport->meta_info, 'description')) {
                $nft->setDescription($nftToImport->meta_info->description);
            }
            if (property_exists($nftToImport->meta_info, 'attributes')) {
                $nft->setAttributes($nftToImport->meta_info->attributes);
            }
        }

        return $nft;
    }

    /**
     * @param mixed $nftToImport
     * @param Nft $nft
     * @return void
     */
    public function setCollection(mixed $nftToImport, Nft $nft, bool $isExternal): void
    {
        if ($nftToImport->synthetic_id) {
            $collection = $this->collectionRepository->find($nftToImport->synthetic_id);
            if (!$collection) {
                $collection = new NftCollection();
                $collection->setId($nftToImport->synthetic_id);
                $collection->setExternal($isExternal);
                $collection->setName($nftToImport->meta_info->collection->name);
                if (property_exists($nftToImport->meta_info->collection, 'attributes')) {
                    $collection->setAttributes($nftToImport->meta_info->collection->attributes);
                }
                $this->collectionRepository->save($collection);
            }
            $nft->setCollection($collection);
        }
    }

    /**
     * @param mixed $nftToImport
     * @param Nft $nft
     * @return void
     */
    public function setMinterAddressAndDid(mixed $nftToImport, Nft $nft): void
    {
        if ($nftToImport->minter_did) {
            $creator = $this->getOrCreateDid($nftToImport->minter_did);
            $nft->setCreator($creator);
        }

        if ($nftToImport->minter_hash) {
            $creatorAddress = $this->getOrCreateAddress($nftToImport->minter_hash);
            $nft->setCreatorAddress($creatorAddress);
        }
    }

    /**
     * @param mixed $nftToImport
     * @param Nft $nft
     * @return void
     */
    public function setOwnerAddressAndDid(mixed $nftToImport, Nft $nft): void
    {
        if ($nftToImport->owner_did) {
            $owner = $this->getOrCreateDid($nftToImport->owner_did);
            print_r($nftToImport->owner_did);
            $nft->setOwner($owner);
        }

        if ($nftToImport->owner_hash) {
            $ownerAddress = $this->getOrCreateAddress($nftToImport->owner_hash);
            $nft->setOwnerAddress($ownerAddress);
        }
    }

    /**
     * @param string $didId
     * @return Did
     */
    public function getOrCreateDid(string $didId): Did
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
    public function getOrCreateAddress(string $puzzleHash): Address
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

    public function importNftProvenanceForAllNfts()
    {
        // TODO: Implement importNftProvenanceForAllNfts() method.
    }
}