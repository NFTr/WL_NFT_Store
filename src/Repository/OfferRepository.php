<?php

namespace App\Repository;

use App\Entity\Nft;
use App\Entity\Offer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Offer>
 *
 * @method Offer|null find($id, $lockMode = null, $lockVersion = null)
 * @method Offer|null findOneBy(array $criteria, array $orderBy = null)
 * @method Offer[]    findAll()
 * @method Offer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OfferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Offer::class);
    }

    public function save(Offer $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Offer $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findNewestOfferForNft($id, string $orderBy): ?Offer
    {
        return $this->createQueryBuilder('o')
            ->join('o.nfts', 'n')
            ->andWhere('n.id = :val')
            ->andWhere(sprintf('o.%s is not null', $orderBy))
            ->setParameter('val', $id)
            ->setMaxResults(1)
            ->orderBy('o.' . $orderBy, 'desc')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findNewestOfferForCollection($collectionId, string $orderBy): ?Offer
    {
        return $this->createQueryBuilder('o')
            ->join('o.nfts', 'n')
            ->andWhere('n.collection = :val')
            ->andWhere(sprintf('o.%s is not null', $orderBy))
            ->setParameter('val', $collectionId)
            ->setMaxResults(1)
            ->orderBy('o.' . $orderBy, 'desc')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findLowestSellOfferForNft(Nft $nft): ?Offer
    {
        return $this->createQueryBuilder('o')
            ->join('o.nfts', 'n')
            ->andWhere('n.id = :val')
            ->setParameter('val', $nft)
            ->setMaxResults(1)
            ->orderBy('o.xchPrice', 'asc')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
