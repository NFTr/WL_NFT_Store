<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230516144540 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add NFT events table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE nft_event (event_index INT NOT NULL, nft_id VARCHAR(255) NOT NULL, owner_id VARCHAR(255) DEFAULT NULL, address_id VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, timestamp DATETIME NOT NULL, xch_price DOUBLE PRECISION DEFAULT NULL, INDEX IDX_7C5F5404E813668D (nft_id), INDEX IDX_7C5F54047E3C61F9 (owner_id), INDEX IDX_7C5F5404F5B7AF75 (address_id), PRIMARY KEY(nft_id, event_index)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE nft_event ADD CONSTRAINT FK_7C5F5404E813668D FOREIGN KEY (nft_id) REFERENCES nft (id)');
        $this->addSql('ALTER TABLE nft_event ADD CONSTRAINT FK_7C5F54047E3C61F9 FOREIGN KEY (owner_id) REFERENCES did (id)');
        $this->addSql('ALTER TABLE nft_event ADD CONSTRAINT FK_7C5F5404F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft_event DROP FOREIGN KEY FK_7C5F5404E813668D');
        $this->addSql('ALTER TABLE nft_event DROP FOREIGN KEY FK_7C5F54047E3C61F9');
        $this->addSql('ALTER TABLE nft_event DROP FOREIGN KEY FK_7C5F5404F5B7AF75');
        $this->addSql('DROP TABLE nft_event');
    }
}
