# WL NFT Store

## Development

### Requirements

* PHP 8.1 or greater
* [Composer](https://getcomposer.org/)
* [Symfony CLI](https://symfony.com/download)
* A running MySQL/MariaDB database

#### For frontend development

* Node.js 18
* [Yarn package manager](https://classic.yarnpkg.com/)

### Setup

Create file `env.local` to specify the database connection string.

```shell
DATABASE_URL="mysql://root:my-secret-pw@127.0.0.1:3306/app?serverVersion=8&charset=utf8mb4"
```

Update file `config/chia.yaml` to specify the collections and profiles you want to import.

```yaml
parameters:
  app.collections:
    - col1vkehesfftd7j9ae7ufaq42rtry69hckm00tf70tc527jkq42qw6sk0pxpy # Ultimate Farmers Club
  app.profiles: []
   app.homeContent:
    logo: https://assets.mainnet.mintgarden.io/thumbnails/34f03d6d638d7a88ee4ef22241a65cf4fbad6a9cc9273bb18927cfba95d46ead_512.png
    motto: 'we <3 chia!'
    title: Chia Friends
    subtitle: 10,000 eco-bit NFTs on Chia, from Chia.
    description: Display your Chia Friend PFP on Twitter and more to help spread the news about building projects on our new NFT standard. There’s also a puzzle embedded in the collection for the community to discover…that’s your only hint for now!
    twitterLink: https://twitter.com/chia_friends
    discordLink: https://discord.com/invite/ECAteZ2B6n
    highlightNfts:
      [
        https://assets.mainnet.mintgarden.io/thumbnails/e49938a641b71a3dead9d309a6f96a6f502b68d2096b4318d7b9a21d0d77633a.png,
        https://assets.mainnet.mintgarden.io/thumbnails/a45e755bf2b6bf7cd9dd39394db6a286b789ba5b34fff8395453a1a5f6e5c7d0.webp,
        https://assets.mainnet.mintgarden.io/thumbnails/74c7f4dff57ef1da134bb3e904195e1d6eb33278f9dcb28d1f464665b52cb548.png,
        https://assets.mainnet.mintgarden.io/thumbnails/944b20b91b985fa30c7215cdefbda66cd0ee450eea609de7f0f80b0297a51de2.png,
        https://assets.mainnet.mintgarden.io/thumbnails/3029e6ad8405272e8cd0921e67e0a3d194a1687acbe8881f01d6cf155ef94c72.png,
      ]
```

Install backend dependencies

```shell
composer install
```

Install frontend dependencies

```shell
yarn install
```

Execute database migrations

```shell
php bin/console doctrine:migrations:migrate
```

Run the NFT importer command

```shell
 php bin/console app:import:nfts -vv --no-debug
```

The `-vv` flag allows you to see the progress and `--no-debug` prevents memory leaks for large collections.  

Run the Offer importer command

```shell
 php bin/console app:import:offers
```

### Run in development

Run the backend

```shell
 symfony server:start
```

Your backend is now accessible under [https://localhost:8000](https://localhost:8000).

Run the frontend development server

```shell
yarn encore dev-server
```

Note that this command outputs an incorrect URL. You have to use the URL provided by the backend
command ([https://localhost:8000](https://localhost:8000)) to access the frontend.
