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

Create file `env.local` to specify the database connection string and your Chia configuration.

```shell
DATABASE_URL="mysql://root:my-secret-pw@127.0.0.1:3306/app?serverVersion=8&charset=utf8mb4"
PROJECT_DID=90fcc1c8d5716c43f6999ccdd1d178613baaba32b27092562f67efb846931156
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