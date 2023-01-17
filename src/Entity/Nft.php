<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\NftRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NftRepository::class)]
#[ApiResource]
class Nft
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $launcherId = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?int $royaltyPercentage = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $royaltyAddress = null;

    #[ORM\Column]
    private array $dataUris = [];

    #[ORM\Column(length: 255)]
    private ?string $dataHash = null;

    #[ORM\Column]
    private array $metaUris = [];

    #[ORM\Column(length: 255)]
    private ?string $metaHash = null;

    #[ORM\Column]
    private array $licenseUris = [];

    #[ORM\Column(length: 255)]
    private ?string $licenseHash = null;

    #[ORM\Column(nullable: true)]
    private ?int $editionNumber = null;

    #[ORM\Column(nullable: true)]
    private ?int $editionTotal = null;

    #[ORM\Column(nullable: true)]
    private ?int $seriesNumber = null;

    #[ORM\Column(nullable: true)]
    private ?int $seriesTotal = null;

    #[ORM\Column(nullable: true)]
    private array $attributes = [];

    #[ORM\Column]
    private ?int $mintHeight = null;

    #[ORM\ManyToOne(inversedBy: 'nfts')]
    private ?NftCollection $collection = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $thumbnailUri = null;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getLauncherId(): ?string
    {
        return $this->launcherId;
    }

    public function setLauncherId(string $launcherId): self
    {
        $this->launcherId = $launcherId;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getRoyaltyPercentage(): ?int
    {
        return $this->royaltyPercentage;
    }

    public function setRoyaltyPercentage(?int $royaltyPercentage): self
    {
        $this->royaltyPercentage = $royaltyPercentage;

        return $this;
    }

    public function getRoyaltyAddress(): ?string
    {
        return $this->royaltyAddress;
    }

    public function setRoyaltyAddress(?string $royaltyAddress): self
    {
        $this->royaltyAddress = $royaltyAddress;

        return $this;
    }

    public function getDataUris(): array
    {
        return $this->dataUris;
    }

    public function setDataUris(array $dataUris): self
    {
        $this->dataUris = $dataUris;

        return $this;
    }

    public function getDataHash(): ?string
    {
        return $this->dataHash;
    }

    public function setDataHash(string $dataHash): self
    {
        $this->dataHash = $dataHash;

        return $this;
    }

    public function getMetaUris(): array
    {
        return $this->metaUris;
    }

    public function setMetaUris(array $metaUris): self
    {
        $this->metaUris = $metaUris;

        return $this;
    }

    public function getMetaHash(): ?string
    {
        return $this->metaHash;
    }

    public function setMetaHash(string $metaHash): self
    {
        $this->metaHash = $metaHash;

        return $this;
    }

    public function getLicenseUris(): array
    {
        return $this->licenseUris;
    }

    public function setLicenseUris(array $licenseUris): self
    {
        $this->licenseUris = $licenseUris;

        return $this;
    }

    public function getLicenseHash(): ?string
    {
        return $this->licenseHash;
    }

    public function setLicenseHash(string $licenseHash): self
    {
        $this->licenseHash = $licenseHash;

        return $this;
    }

    public function getEditionNumber(): ?int
    {
        return $this->editionNumber;
    }

    public function setEditionNumber(?int $editionNumber): self
    {
        $this->editionNumber = $editionNumber;

        return $this;
    }

    public function getEditionTotal(): ?int
    {
        return $this->editionTotal;
    }

    public function setEditionTotal(?int $editionTotal): self
    {
        $this->editionTotal = $editionTotal;

        return $this;
    }

    public function getSeriesNumber(): ?int
    {
        return $this->seriesNumber;
    }

    public function setSeriesNumber(?int $seriesNumber): self
    {
        $this->seriesNumber = $seriesNumber;

        return $this;
    }

    public function getSeriesTotal(): ?int
    {
        return $this->seriesTotal;
    }

    public function setSeriesTotal(?int $seriesTotal): self
    {
        $this->seriesTotal = $seriesTotal;

        return $this;
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setAttributes(?array $attributes): self
    {
        $this->attributes = $attributes;

        return $this;
    }

    public function getMintHeight(): ?int
    {
        return $this->mintHeight;
    }

    public function setMintHeight(int $mintHeight): self
    {
        $this->mintHeight = $mintHeight;

        return $this;
    }

    public function getCollection(): ?NftCollection
    {
        return $this->collection;
    }

    public function setCollection(?NftCollection $collection): self
    {
        $this->collection = $collection;

        return $this;
    }

    public function getThumbnailUri(): ?string
    {
        return $this->thumbnailUri;
    }

    public function setThumbnailUri(?string $thumbnailUri): self
    {
        $this->thumbnailUri = $thumbnailUri;

        return $this;
    }
}
