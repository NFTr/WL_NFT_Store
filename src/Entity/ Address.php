<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\AddressRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\MultipleFieldsSearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection()
    ]
)]
#[ApiFilter(MultipleFieldsSearchFilter::class, properties: [
    'id' => 'exact', 'name' => 'partial', 'encodeAddress' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'name', 'encodeAddress'], arguments: ['orderParameterName' => 'order'])]

class Address
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $encodeAddress = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'creatorAddress', targetEntity: Nft::class)]
    private Collection $createdNfts;

    #[ORM\OneToMany(mappedBy: 'ownerAddress', targetEntity: Nft::class)]
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

    public function getEncodeAddress(): ?string
    {
        return $this->encodeAddress;
    }

    public function setEncodeAddress(string $encodeAddress): self
    {
        $this->encodeAddress = $encodeAddress;

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