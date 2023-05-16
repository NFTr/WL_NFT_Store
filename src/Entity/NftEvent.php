<?php

namespace App\Entity;

use ApiPlatform\Metadata\GetCollection;
use App\Repository\NftEventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NftEventRepository::class)]
class NftEvent
{
    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    #[ORM\Id]
    private ?Nft $nft = null;

    #[ORM\Column(length: 255)]
    #[Groups('nft:get')]
    private ?string $type = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('nft:get')]
    private ?\DateTimeInterface $timestamp = null;

    #[ORM\Column(nullable: true)]
    #[Groups('nft:get')]
    private ?float $xch_price = null;

    #[ORM\ManyToOne]
    #[Groups('nft:get')]
    private ?Did $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups('nft:get')]
    private ?Address $address = null;

    #[ORM\Column]
    #[Groups('nft:get')]
    #[ORM\Id]
    private ?int $event_index = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNft(): ?Nft
    {
        return $this->nft;
    }

    public function setNft(?Nft $nft): self
    {
        $this->nft = $nft;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getTimestamp(): ?\DateTimeInterface
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeInterface $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getXchPrice(): ?float
    {
        return $this->xch_price;
    }

    public function setXchPrice(?float $xch_price): self
    {
        $this->xch_price = $xch_price;

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

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getEventIndex(): ?int
    {
        return $this->event_index;
    }

    public function setEventIndex(int $event_index): self
    {
        $this->event_index = $event_index;

        return $this;
    }
}
