<?php

namespace App\Filter;
use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use App\Entity\Offer;

final class LowestSellOfferFilter extends AbstractFilter
{
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {
        if ($property !== 'lowestSellOffer') {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $offerAlias = $queryNameGenerator->generateJoinAlias('offer'); // Generate a unique alias

        $queryBuilder
            ->addSelect($offerAlias)
            ->leftJoin(sprintf('%s.offers', $alias), $offerAlias)
            ->andWhere(sprintf('%s.side = 1', $offerAlias))
            ->andWhere(sprintf('%s.status = 0', $offerAlias))
            // ->setParameter('side', Offer::SIDE_OFFERED)
            // ->setParameter('status', 0)
            ->orderBy(sprintf('%s.xchPrice', $offerAlias), $value);

        // $sql = $queryBuilder->getQuery()->getSQL();
        // echo $sql;
        $logger = $context['logger'] ?? null;
if ($logger !== null) {
    $logger->info($queryBuilder->getQuery()->getSQL());
}
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'lowestSellOffer' => [
                'property' => 'lowestSellOffer',
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Sort by lowest sell offer (use "asc" or "desc")',
                    'name' => 'lowestSellOffer',
                    'type' => 'string',
                ],
            ],
        ];
    }
}