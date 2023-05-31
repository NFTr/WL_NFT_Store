<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Filter\MultipleFieldsSearchFilter;
use App\Repository\AddressRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

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
    #[Groups('nft:get')]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $encodedAddress = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('nft:get')]
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

    public function getEncodedAddress(): ?string
    {
        return $this->encodedAddress;
    }

    public function setEncodedAddress(string $encodedAddress): self
    {
        $this->encodedAddress = $encodedAddress;

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
            $createdNft->setCreatorAddress($this);
        }

        return $this;
    }

    public function removeCreatedNft(Nft $createdNft): self
    {
        if ($this->createdNfts->removeElement($createdNft)) {
            // set the owning side to null (unless already changed)
            if ($createdNft->getCreatorAddress() === $this) {
                $createdNft->setCreatorAddress(null);
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
            $ownedNft->setOwnerAddress($this);
        }

        return $this;
    }

    public function removeOwnedNft(Nft $ownedNft): self
    {
        if ($this->ownedNfts->removeElement($ownedNft)) {
            // set the owning side to null (unless already changed)
            if ($ownedNft->getOwnerAddress() === $this) {
                $ownedNft->setOwnerAddress(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->getEncodedAddress();
    }
}