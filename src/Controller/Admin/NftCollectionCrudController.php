<?php

namespace App\Controller\Admin;

use App\Entity\NftCollection;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class NftCollectionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return NftCollection::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->setMaxLength(255),
            TextField::new('name'),
            TextareaField::new('description')->onlyOnForms(),
        ];
    }

}
