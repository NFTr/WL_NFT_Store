<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230112113327 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE nft (id VARCHAR(255) NOT NULL, collection_id VARCHAR(255) DEFAULT NULL, launcher_id VARCHAR(255) NOT NULL, name LONGTEXT DEFAULT NULL, description LONGTEXT DEFAULT NULL, royalty_percentage INT DEFAULT NULL, royalty_address VARCHAR(255) DEFAULT NULL, data_uris LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', data_hash VARCHAR(255) NOT NULL, meta_uris LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', meta_hash VARCHAR(255) NOT NULL, license_uris LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', license_hash VARCHAR(255) NOT NULL, edition_number INT DEFAULT NULL, edition_total INT DEFAULT NULL, series_number INT DEFAULT NULL, series_total INT DEFAULT NULL, attributes LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', mint_height INT NOT NULL, thumbnail_uri LONGTEXT DEFAULT NULL, INDEX IDX_D9C7463C514956FD (collection_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE nft_collection (id VARCHAR(255) NOT NULL, name LONGTEXT NOT NULL, description LONGTEXT DEFAULT NULL, attributes LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463C514956FD FOREIGN KEY (collection_id) REFERENCES nft_collection (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463C514956FD');
        $this->addSql('DROP TABLE nft');
        $this->addSql('DROP TABLE nft_collection');
    }
}
