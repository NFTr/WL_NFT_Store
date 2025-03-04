<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Common\Filter\OrderFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Filter\MultipleFieldsSearchFilter;
use App\Repository\NftRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NftRepository::class)]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => 'nft:get']),
        new GetCollection(normalizationContext: ['groups' => 'nft:collection:get'])
    ]
)]
#[ApiResource(
    uriTemplate: '/collections/{id}/nfts',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'nfts',
            fromClass: NftCollection::class
        )
    ],
    normalizationContext: ['groups' => 'nft:collection:get']
)]
#[ApiResource(
    uriTemplate: '/dids/{id}/created_nfts',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'createdNfts',
            fromClass: Did::class
        )
    ],
    normalizationContext: ['groups' => 'nft:collection:get']
)]
#[ApiResource(
    uriTemplate: '/dids/{id}/owned_nfts',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'ownedNfts',
            fromClass: Did::class
        )
    ],
    normalizationContext: ['groups' => 'nft:collection:get']
)]

#[ApiResource(
    uriTemplate: '/addresses/{id}/created_nfts',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'createdNfts',
            fromClass: Address::class
        )
    ],
    normalizationContext: ['groups' => 'nft:collection:get']
)]
#[ApiResource(
    uriTemplate: '/addresses/{id}/owned_nfts',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'ownedNfts',
            fromClass: Address::class
        )
    ],
    normalizationContext: ['groups' => 'nft:collection:get']
)]

#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    'id' => 'exact', 'name' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'name', 'lowestSellOffer.xchPrice' => ['nulls_comparison' => OrderFilterInterface::NULLS_ALWAYS_LAST]])]
#[GetCollection (normalizationContext: ['groups' => 'nft:collection:get'])]
class Nft
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    #[Groups(['nft:get', 'nft:collection:get'])]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $launcherId = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['nft:get', 'nft:collection:get'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('nft:get')]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?int $royaltyPercentage = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('nft:get')]
    private ?string $royaltyAddress = null;

    #[ORM\Column]
    #[Groups('nft:get')]
    private array $dataUris = [];

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $dataHash = null;

    #[ORM\Column]
    #[Groups('nft:get')]
    private array $metaUris = [];

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $metaHash = null;

    #[ORM\Column]
    #[Groups('nft:get')]
    private array $licenseUris = [];

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $licenseHash = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?int $editionNumber = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?int $editionTotal = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?int $seriesNumber = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?int $seriesTotal = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private array $attributes = [];

    #[ORM\Column]
    #[Groups('nft:get')]
    private ?int $mintHeight = null;

    #[ORM\ManyToOne(inversedBy: 'nfts')]
    #[Groups('nft:get')]
    private ?NftCollection $collection = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['nft:get', 'nft:collection:get'])]
    private ?string $thumbnailUri = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('nft:get')]
    private ?string $previewUri = null;

    #[ORM\ManyToOne(inversedBy: 'createdNfts')]
    #[Groups('nft:get')]
    private ?Did $creator = null;

    #[ORM\ManyToOne(inversedBy: 'ownedNfts')]
    #[Groups('nft:get')]
    private ?Did $owner = null;

    #[ORM\ManyToOne(inversedBy: 'createdNfts')]
    #[Groups('nft:get')]
    private ?Address $creatorAddress = null;

    #[ORM\ManyToOne(inversedBy: 'ownedNfts')]
    #[Groups('nft:get')]
    private ?Address $ownerAddress = null;

    #[ORM\ManyToMany(targetEntity: Offer::class, mappedBy: 'nfts')]
    private Collection $offers;

    #[ORM\OneToOne()]
    #[Groups('nft:collection:get')]
    private ?Offer $lowestSellOffer = null;

    #[ORM\OneToMany(mappedBy: 'nft', targetEntity: NftEvent::class, orphanRemoval: true)]
    #[Groups('nft:get')]
    private Collection $events;

    public function __construct()
    {
        $this->offers = new ArrayCollection();
        $this->events = new ArrayCollection();
    }

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

    public function getPreviewUri(): ?string
    {
        return $this->previewUri;
    }

    public function setPreviewUri(?string $previewUri): self
    {
        $this->previewUri = $previewUri;

        return $this;
    }

    public function getCreator(): ?Did
    {
        return $this->creator;
    }

    public function setCreator(?Did $creator): self
    {
        $this->creator = $creator;

        return $this;
    }

    public function getOwner(): ?Did
    {
        return $this->owner;
    }

    public function setOwner(?Did $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatorAddress(): ?Address
    {
        return $this->creatorAddress;
    }

    public function setCreatorAddress(?Address $creatorAddress): self
    {
        $this->creatorAddress = $creatorAddress;

        return $this;
    }

    public function getOwnerAddress(): ?Address
    {
        return $this->ownerAddress;
    }

    public function setOwnerAddress(?Address $ownerAddress): self
    {
        $this->ownerAddress = $ownerAddress;

        return $this;
    }

    /**
     * @return Collection<int, Offer>
     */
    public function getOffers(): Collection
    {
        return $this->offers;
    }

    public function addOffer(Offer $offer): self
    {
        if (!$this->offers->contains($offer)) {
            $this->offers->add($offer);
            $offer->addNft($this);
        }

        return $this;
    }

    public function removeOffer(Offer $offer): self
    {
        if ($this->offers->removeElement($offer)) {
            $offer->removeNft($this);
        }

        return $this;
    }

    public function getLowestSellOffer(): ?Offer
    {
        return $this->lowestSellOffer;
    }

    public function setLowestSellOffer(?Offer $lowestSellOffer): self
    {
        $this->lowestSellOffer = $lowestSellOffer;

        return $this;
    }

    /**
     * @return Collection<int, NftEvent>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(NftEvent $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setNft($this);
        }

        return $this;
    }

    public function removeEvent(NftEvent $event): self
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getNft() === $this) {
                $event->setNft(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->getId();
    }
}
