<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230317105823 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add offer table and link it to the NFTs involved in the offer';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE offer (id VARCHAR(255) NOT NULL, status INT NOT NULL, offered LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', requested LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', date_found DATE NOT NULL, date_completed DATE DEFAULT NULL, offerstring LONGTEXT NOT NULL, source VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE offer_nft (offer_id VARCHAR(255) NOT NULL, nft_id VARCHAR(255) NOT NULL, INDEX IDX_F5F227A453C674EE (offer_id), INDEX IDX_F5F227A4E813668D (nft_id), PRIMARY KEY(offer_id, nft_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE offer_nft ADD CONSTRAINT FK_F5F227A453C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE offer_nft ADD CONSTRAINT FK_F5F227A4E813668D FOREIGN KEY (nft_id) REFERENCES nft (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE offer_nft DROP FOREIGN KEY FK_F5F227A453C674EE');
        $this->addSql('ALTER TABLE offer_nft DROP FOREIGN KEY FK_F5F227A4E813668D');
        $this->addSql('DROP TABLE offer');
        $this->addSql('DROP TABLE offer_nft');
    }
}
