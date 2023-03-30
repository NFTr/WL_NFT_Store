<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\DidRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\MultipleFieldsSearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;

#[ORM\Entity(repositoryClass: DidRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection()
    ]
)]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    'id' => 'exact', 'name' => 'partial', 'encodedId' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'name', 'encodedId'], arguments: ['orderParameterName' => 'order'])]

class Did
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $encodedId = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'creator', targetEntity: Nft::class)]
    private Collection $createdNfts;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Nft::class)]
    private Collection $ownedNfts;

    public function __construct()
    {
        $this->createdNfts = new ArrayCollection();
        $this->ownedNfts = new ArrayCollection();
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

    public function getEncodedId(): ?string
    {
        return $this->encodedId;
    }

    public function setEncodedId(string $encodedId): self
    {
        $this->encodedId = $encodedId;

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

    /**
     * @return Collection<int, Nft>
     */
    public function getCreatedNfts(): Collection
    {
        return $this->createdNfts;
    }

    public function addCreatedNft(Nft $createdNft): self
    {
        if (!$this->createdNfts->contains($createdNft)) {
            $this->createdNfts->add($createdNft);
            $createdNft->setCreator($this);
        }

        return $this;
    }

    public function removeCreatedNft(Nft $createdNft): self
    {
        if ($this->createdNfts->removeElement($createdNft)) {
            // set the owning side to null (unless already changed)
            if ($createdNft->getCreator() === $this) {
                $createdNft->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Nft>
     */
    public function getOwnedNfts(): Collection
    {
        return $this->ownedNfts;
    }

    public function addOwnedNft(Nft $ownedNft): self
    {
        if (!$this->ownedNfts->contains($ownedNft)) {
            $this->ownedNfts->add($ownedNft);
            $ownedNft->setOwner($this);
        }

        return $this;
    }

    public function removeOwnedNft(Nft $ownedNft): self
    {
        if ($this->ownedNfts->removeElement($ownedNft)) {
            // set the owning side to null (unless already changed)
            if ($ownedNft->getOwner() === $this) {
                $ownedNft->setOwner(null);
            }
        }

        return $this;
    }
}
