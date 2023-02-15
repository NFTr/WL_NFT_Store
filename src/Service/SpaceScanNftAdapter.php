<?php

namespace App\Service;

use App\Entity\Did;
use App\Entity\Nft;
use App\Entity\NftCollection;
use App\Repository\DidRepository;
use App\Repository\NftCollectionRepository;
use App\Repository\NftRepository;
use App\Utilities\PuzzleHashConverter;
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
    private NftCollectionRepository $collectionRepository;
    private PuzzleHashConverter $puzzleHashConverter;

    private string $baseUrl;

    public function __construct(string $baseUrl, HttpClientInterface $client, LoggerInterface $logger, NftRepository $nftRepository, DidRepository $didRepository, NftCollectionRepository $collectionRepository, PuzzleHashConverter $puzzleHashConverter)
    {
        $this->baseUrl = $baseUrl;

        $this->client = $client;
        $this->logger = $logger;
        $this->nftRepository = $nftRepository;
        $this->didRepository = $didRepository;
        $this->collectionRepository = $collectionRepository;
        $this->puzzleHashConverter = $puzzleHashConverter;
    }

    /**
     * @return Nft[]
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    function importNftsByCreatorId(string $creatorId): array
    {
        $this->logger->info("Fetching NFTs created by profile $creatorId");
        $nfts = [];
        $page = 1;
        while (true) {
            $response = $this->client->request('GET', "$this->baseUrl/1/xch/did/$creatorId?page=$page&count=100&type=nft");
            $JsonResponse = json_decode($response->getContent());
            $nftsToImport = $JsonResponse->created;
            $page += 1;
            if (sizeof($nftsToImport) == 0) {
                break;
            }

            $creator = $this->didRepository->find($creatorId);
            if (!$creator) {
                $creator = new Did();
                $creator->setId($creatorId);
                $creator->setEncodedId($this->puzzleHashConverter->encodePuzzleHash($creatorId, 'did:chia:'));
                $this->didRepository->save($creator);
            }

            foreach ($nftsToImport as $nftToImport) {
                $this->logger->info("Importing NFT $nftToImport->nft_id");
                $nft = $this->nftRepository->find($nftToImport->nft_id);

                $nft = $this->convertAndUpdateNft($nft, $nftToImport);

                $nft->setCreator($creator);

                if ($nftToImport->synthetic_id) {
                    $collection = $this->collectionRepository->find($nftToImport->synthetic_id);
                    if (!$collection) {
                        $collection = new NftCollection();
                        $collection->setId($nftToImport->synthetic_id);
                        $collection->setName($nftToImport->meta_info->collection->name);
                        $collection->setAttributes($nftToImport->meta_info->collection->attributes);
                        $this->collectionRepository->save($collection);
                    }
                    $nft->setCollection($collection);
                }


                $this->nftRepository->save($nft, true);
                $nfts[] = $nft;
            }
        }
        return $nfts;
    }

    function importNftsByCollection(string $collectionId): array
    {
        $this->logger->info("Fetching NFTs from collection $collectionId");
        $nfts = [];
        $page = 1;
        while (true) {
            $response = $this->client->request('GET', "$this->baseUrl/api/nft/collection/$collectionId?coin=xch&version=1&page=$page&count=100");
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

                if ($nftToImport->minter_did) {
                    $creator = $this->didRepository->find($nftToImport->minter_did);
                    if (!$creator) {
                        $creator = new Did();
                        $creator->setId($nftToImport->minter_did);
                        $creator->setEncodedId($this->puzzleHashConverter->encodePuzzleHash($nftToImport->minter_did, 'did:chia:'));
                        $this->didRepository->save($creator);
                    }
                    $nft->setCreator($creator);
                }

                if ($nftToImport->synthetic_id) {
                    $collection = $this->collectionRepository->find($nftToImport->synthetic_id);
                    if (!$collection) {
                        $collection = new NftCollection();
                        $collection->setId($nftToImport->synthetic_id);
                        $collection->setName($nftToImport->meta_info->collection->name);
                        $collection->setAttributes($nftToImport->meta_info->collection->attributes);
                        $this->collectionRepository->save($collection);
                    }
                    $nft->setCollection($collection);
                }


                $this->nftRepository->save($nft, true);
                $nfts[] = $nft;
            }
        }
        return $nfts;
    }

    private function convertAndUpdateNft(?Nft $nft, mixed $nftToImport): Nft
    {
        $nftId = trim($nftToImport->nft_id);
        if (!$nft) {
            $nft = new Nft();
            $nft->setId($nftId);
            $nft->setLauncherId(str_replace('0x', '', $nftToImport->nft_info->launcher_id));
            $nft->setRoyaltyPercentage($nftToImport->nft_info->royalty_percentage);
            $nft->setRoyaltyAddress($this->puzzleHashConverter->encodePuzzleHash($nftToImport->nft_info->royalty_puzzle_hash));

            $nft->setMintHeight($nftToImport->created_height);
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

        $nft->setName($nftToImport->meta_info->name);
        $nft->setDescription($nftToImport->meta_info->description);
        $nft->setAttributes($nftToImport->meta_info->attributes);

        return $nft;
    }
}