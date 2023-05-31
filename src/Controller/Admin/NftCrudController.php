<?php

namespace App\Controller\Admin;

use App\Entity\Nft;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;

class NftCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Nft::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('name'),
            TextareaField::new('description')->hideOnIndex(),
            UrlField::new('thumbnailUri'),
            UrlField::new('previewUri'),
            AssociationField::new('creator')->setCrudController(DidCrudController::class),
            AssociationField::new('owner')->setCrudController(DidCrudController::class),
            AssociationField::new('collection')->setCrudController(NftCollectionCrudController::class)
        ];
    }
}
