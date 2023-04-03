<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230403152304 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Store lowest sell offer with NFT';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft ADD lowest_sell_offer_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463CC23D761B FOREIGN KEY (lowest_sell_offer_id) REFERENCES offer (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463CC23D761B');
        $this->addSql('ALTER TABLE nft DROP lowest_sell_offer_id');
    }
}
