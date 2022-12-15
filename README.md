
## Prerequisites

* PHP 8.1 or greater
* MySQL/MariaDB database

### For frontend development
* Node.js 18
* Yarn package manager

## Setup

Create file `env.local` to specify the database connection string 
```shell
DATABASE_URL="mysql://root:my-secret-pw@127.0.0.1:3306/app?serverVersion=8&charset=utf8mb4"
```

Install frontend dependencies

```
yarn install
```

Run the backend

```shell
 symfony server:start
```

Run the frontend development server

```shell
yarn encore dev-server
```