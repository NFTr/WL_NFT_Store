<?php

namespace App\Controller\Admin;

use App\Entity\Did;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class DidCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Did::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('encodedId')->setMaxLength(255),
            TextField::new('name'),
        ];
    }
}
