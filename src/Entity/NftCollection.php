<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\NftCollectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NftCollectionRepository::class)]
#[ApiResource(shortName: 'collection')]
class NftCollection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private array $attributes = [];

    #[ORM\OneToMany(mappedBy: 'collection', targetEntity: Nft::class)]
    private NftCollection $nfts;

    public function __construct()
    {
        $this->nfts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
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

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setAttributes(?array $attributes): self
    {
        $this->attributes = $attributes;

        return $this;
    }

    /**
     * @return NftCollection<int, Nft>
     */
    public function getNfts(): NftCollection
    {
        return $this->nfts;
    }

    public function addNft(Nft $nft): self
    {
        if (!$this->nfts->contains($nft)) {
            $this->nfts->add($nft);
            $nft->setCollection($this);
        }

        return $this;
    }

    public function removeNft(Nft $nft): self
    {
        if ($this->nfts->removeElement($nft)) {
            // set the owning side to null (unless already changed)
            if ($nft->getCollection() === $this) {
                $nft->setCollection(null);
            }
        }

        return $this;
    }
}
