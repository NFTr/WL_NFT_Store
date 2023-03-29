<?php
namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;

use Doctrine\ORM\QueryBuilder;

use Symfony\Component\PropertyInfo\Type;


final class MultipleFieldsSearchFilter extends AbstractFilter
{
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void
    {
        if ($property !== 'search') {
            return;
        }

        $fields = $this->getProperties();
        if (empty($fields)) {
            throw new \InvalidArgumentException('At least one field must be specified.');
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $orExpressions = [];
        foreach (array_keys($fields) as $k => $field) {
            if ($this->isPropertyNested($field, $resourceClass)) {
                $exploded_field = explode('.', $field);
                if (!in_array($exploded_field[0], $queryBuilder->getAllAliases())) {
                    $queryBuilder->leftJoin($alias . '.' . $exploded_field[0], $exploded_field[0]);
                }
                $orExpressions[] = sprintf('%s.%s LIKE :search', $exploded_field[0], $exploded_field[1]);
            } else {
                $orExpressions[] = sprintf('%s.%s LIKE :search', $alias, $field);
            }
        }

        $queryBuilder
            ->andWhere(implode(' OR ', $orExpressions))
            ->setParameter('search', "%$value%");

    }


    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Search for entities based on one or multiple fields.',
                'swagger' => [
                    'description' => 'Search for entities based on one or multiple fields.',
                    'name' => 'Search',
                    'type' => 'string',
                ],
            ],
        ];
    }
}