<?php

namespace App\Service;

use App\Entity\Nft;
use App\Entity\NftCollection;
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
    private NftCollectionRepository $collectionRepository;
    private PuzzleHashConverter $puzzleHashConverter;

    private string $baseUrl;
    private string $projectDid;

    public function __construct(string $baseUrl, string $projectDid, HttpClientInterface $client, LoggerInterface $logger, NftRepository $nftRepository, NftCollectionRepository $collectionRepository, PuzzleHashConverter $puzzleHashConverter)
    {
        $this->baseUrl = $baseUrl;
        $this->projectDid = $projectDid;

        $this->client = $client;
        $this->logger = $logger;
        $this->nftRepository = $nftRepository;
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
    function importAllNfts(): array
    {
        $nfts = [];
        $page = 1;
        while (true) {
            $response = $this->client->request('GET', "$this->baseUrl/1/xch/did/$this->projectDid?page=$page&count=100&type=nft");
            $JsonResponse = json_decode($response->getContent());
            $nftsToImport = $JsonResponse->created;
            $page += 1;
            if (sizeof($nftsToImport) == 0) {
                break;
            }
            foreach ($nftsToImport as $nftToImport) {
                $this->logger->info("Importing NFT $nftToImport->nft_id");
                $nft = $this->nftRepository->find($nftToImport->nft_id);

                $nft = $this->convertAndUpdateNft($nft, $nftToImport);

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
        if (!$nft) {
            $nft = new Nft();
            $nft->setId(trim($nftToImport->nft_id));
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

        $nft->setThumbnailUri("https://assets.spacescan.io/xch/img/nft/th/$nftToImport->nft_id.webp");
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