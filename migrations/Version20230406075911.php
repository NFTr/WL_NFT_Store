<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230406075911 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id VARCHAR(255) NOT NULL, encode_address VARCHAR(255) NOT NULL, name LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE nft ADD creator_address_id VARCHAR(255) DEFAULT NULL, ADD owner_address_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463C8D4988EE FOREIGN KEY (creator_address_id) REFERENCES address (id)');
        $this->addSql('ALTER TABLE nft ADD CONSTRAINT FK_D9C7463CA7DD3630 FOREIGN KEY (owner_address_id) REFERENCES address (id)');
        $this->addSql('CREATE INDEX IDX_D9C7463C8D4988EE ON nft (creator_address_id)');
        $this->addSql('CREATE INDEX IDX_D9C7463CA7DD3630 ON nft (owner_address_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463C8D4988EE');
        $this->addSql('ALTER TABLE nft DROP FOREIGN KEY FK_D9C7463CA7DD3630');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP INDEX IDX_D9C7463C8D4988EE ON nft');
        $this->addSql('DROP INDEX IDX_D9C7463CA7DD3630 ON nft');
        $this->addSql('ALTER TABLE nft DROP creator_address_id, DROP owner_address_id');
    }
}
