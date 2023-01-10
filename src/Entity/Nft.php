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
    private ?string $launcher_id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?int $royalty_percentage = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $royalty_address = null;

    #[ORM\Column]
    private array $data_uris = [];

    #[ORM\Column(length: 255)]
    private ?string $data_hash = null;

    #[ORM\Column]
    private array $meta_uris = [];

    #[ORM\Column(length: 255)]
    private ?string $meta_hash = null;

    #[ORM\Column]
    private array $license_uris = [];

    #[ORM\Column(length: 255)]
    private ?string $license_hash = null;

    #[ORM\Column(nullable: true)]
    private ?int $edition_number = null;

    #[ORM\Column(nullable: true)]
    private ?int $edition_total = null;

    #[ORM\Column(nullable: true)]
    private ?int $series_number = null;

    #[ORM\Column(nullable: true)]
    private ?int $series_total = null;

    #[ORM\Column(nullable: true)]
    private array $attributes = [];

    #[ORM\Column]
    private ?int $mint_height = null;

    #[ORM\ManyToOne(inversedBy: 'nfts')]
    private ?NftCollection $collection = null;

    public function getId(): ?int
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
        return $this->launcher_id;
    }

    public function setLauncherId(string $launcher_id): self
    {
        $this->launcher_id = $launcher_id;

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
        return $this->royalty_percentage;
    }

    public function setRoyaltyPercentage(?int $royalty_percentage): self
    {
        $this->royalty_percentage = $royalty_percentage;

        return $this;
    }

    public function getRoyaltyAddress(): ?string
    {
        return $this->royalty_address;
    }

    public function setRoyaltyAddress(?string $royalty_address): self
    {
        $this->royalty_address = $royalty_address;

        return $this;
    }

    public function getDataUris(): array
    {
        return $this->data_uris;
    }

    public function setDataUris(array $data_uris): self
    {
        $this->data_uris = $data_uris;

        return $this;
    }

    public function getDataHash(): ?string
    {
        return $this->data_hash;
    }

    public function setDataHash(string $data_hash): self
    {
        $this->data_hash = $data_hash;

        return $this;
    }

    public function getMetaUris(): array
    {
        return $this->meta_uris;
    }

    public function setMetaUris(array $meta_uris): self
    {
        $this->meta_uris = $meta_uris;

        return $this;
    }

    public function getMetaHash(): ?string
    {
        return $this->meta_hash;
    }

    public function setMetaHash(string $meta_hash): self
    {
        $this->meta_hash = $meta_hash;

        return $this;
    }

    public function getLicenseUris(): array
    {
        return $this->license_uris;
    }

    public function setLicenseUris(array $license_uris): self
    {
        $this->license_uris = $license_uris;

        return $this;
    }

    public function getLicenseHash(): ?string
    {
        return $this->license_hash;
    }

    public function setLicenseHash(string $license_hash): self
    {
        $this->license_hash = $license_hash;

        return $this;
    }

    public function getEditionNumber(): ?int
    {
        return $this->edition_number;
    }

    public function setEditionNumber(?int $edition_number): self
    {
        $this->edition_number = $edition_number;

        return $this;
    }

    public function getEditionTotal(): ?int
    {
        return $this->edition_total;
    }

    public function setEditionTotal(?int $edition_total): self
    {
        $this->edition_total = $edition_total;

        return $this;
    }

    public function getSeriesNumber(): ?int
    {
        return $this->series_number;
    }

    public function setSeriesNumber(?int $series_number): self
    {
        $this->series_number = $series_number;

        return $this;
    }

    public function getSeriesTotal(): ?int
    {
        return $this->series_total;
    }

    public function setSeriesTotal(?int $series_total): self
    {
        $this->series_total = $series_total;

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
        return $this->mint_height;
    }

    public function setMintHeight(int $mint_height): self
    {
        $this->mint_height = $mint_height;

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
}
