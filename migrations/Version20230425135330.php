<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230425135330 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename field in address, add index';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE address CHANGE encode_address encoded_address VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE nft DROP INDEX FK_D9C7463CC23D761B, ADD UNIQUE INDEX UNIQ_D9C7463CC23D761B (lowest_sell_offer_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft DROP INDEX UNIQ_D9C7463CC23D761B, ADD INDEX FK_D9C7463CC23D761B (lowest_sell_offer_id)');
        $this->addSql('ALTER TABLE address CHANGE encoded_address encode_address VARCHAR(255) NOT NULL');
    }
}
