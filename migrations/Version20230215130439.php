<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215130439 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add table to store DIDs, add relationships for owner and creator of NFTs';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE did (id VARCHAR(255) NOT NULL, encoded_id VARCHAR(255) NOT NULL, name LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE nft ADD creator_id VARCHAR(255) DEFAULT NULL, ADD owner_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463C61220EA6 FOREIGN KEY (creator_id) REFERENCES did (id)');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES did (id)');
        $this->addSql('CREATE INDEX IDX_D9C7463C61220EA6 ON nft (creator_id)');
        $this->addSql('CREATE INDEX IDX_D9C7463C7E3C61F9 ON nft (owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463C61220EA6');
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463C7E3C61F9');
        $this->addSql('DROP TABLE did');
        $this->addSql('DROP INDEX IDX_D9C7463C61220EA6 ON nft');
        $this->addSql('DROP INDEX IDX_D9C7463C7E3C61F9 ON nft');
        $this->addSql('ALTER TABLE nft DROP creator_id, DROP owner_id');
    }
}
