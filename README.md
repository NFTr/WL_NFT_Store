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