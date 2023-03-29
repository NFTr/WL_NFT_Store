<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\NftCollectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\MultipleFieldsSearchFilter;

#[ORM\Entity(repositoryClass: NftCollectionRepository::class)]
#[ApiResource(
    shortName: 'Collection',
    operations: [
        new Get(),
        new GetCollection()
    ],
    normalizationContext: ['groups' => ['get']]
)]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    'id' => 'exact', 'name' => 'partial'])]

class NftCollection
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    #[Groups('get')]
    private ?string $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups('get')]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('get')]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    #[Groups('get')]
    private array $attributes = [];

    #[ORM\OneToMany(mappedBy: 'collection', targetEntity: Nft::class)]
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
