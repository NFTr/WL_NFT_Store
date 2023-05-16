<?php

namespace App\Entity;

use App\Repository\NftEventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NftEventRepository::class)]
class NftEvent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Nft $nft = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $timestamp = null;

    #[ORM\Column(nullable: true)]
    private ?float $xch_price = null;

    #[ORM\ManyToOne]
    private ?Did $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Address $address = null;

    #[ORM\Column]
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
