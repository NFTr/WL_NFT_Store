<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Repository\OfferRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OfferRepository::class)]
#[ApiResource(
    uriTemplate: '/nfts/{id}/offers',
    operations: [new GetCollection()],
    uriVariables: [
        'id' => new Link(
            fromProperty: 'offers',
            fromClass: Nft::class
        )
    ]
)]
class Offer
{
    #[ORM\Id]
    #[ORM\Column]
    private ?string $id = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\Column]
    private array $offered = [];

    #[ORM\Column]
    private array $requested = [];

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_found = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_completed = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $offerstring = null;


    const SOURCE_DEXIE = 'dexie';
    const SOURCE_LOCAL = 'local';

    #[ORM\Column]
    private ?string $source = null;

    #[ORM\ManyToMany(targetEntity: Nft::class, inversedBy: 'offers')]
    private Collection $nfts;

    public function __construct()
    {
        $this->nfts = new ArrayCollection();
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

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getOffered(): array
    {
        return $this->offered;
    }

    public function setOffered(array $offered): self
    {
        $this->offered = $offered;

        return $this;
    }

    public function getRequested(): array
    {
        return $this->requested;
    }

    public function setRequested(?array $requested): self
    {
        $this->requested = $requested;

        return $this;
    }

    public function getDateFound(): ?\DateTimeInterface
    {
        return $this->date_found;
    }

    public function setDateFound(\DateTimeInterface $date_found): self
    {
        $this->date_found = $date_found;

        return $this;
    }

    public function getDateCompleted(): ?\DateTimeInterface
    {
        return $this->date_completed;
    }

    public function setDateCompleted(?\DateTimeInterface $date_completed): self
    {
        $this->date_completed = $date_completed;

        return $this;
    }

    public function getOfferstring(): ?string
    {
        return $this->offerstring;
    }

    public function setOfferstring(string $offerstring): self
    {
        $this->offerstring = $offerstring;

        return $this;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(string $source): self
    {
        if (!in_array($source, array(self::SOURCE_DEXIE, self::SOURCE_LOCAL))) {
            throw new \InvalidArgumentException("Invalid source");
        }
        $this->source = $source;

        return $this;
    }

    /**
     * @return Collection<int, Nft>
     */
    public function getNfts(): Collection
    {
        return $this->nfts;
    }

    public function addNft(Nft $nft): self
    {
        if (!$this->nfts->contains($nft)) {
            $this->nfts->add($nft);
        }

        return $this;
    }

    public function removeNft(Nft $nft): self
    {
        $this->nfts->removeElement($nft);

        return $this;
    }
}
