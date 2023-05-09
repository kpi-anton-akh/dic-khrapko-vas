### Built with

- Runtime environment: Node.js
- Web framework: Nest.js
- ORM: TypeORM
- Cloud Services: Azure Database for PostgreSQL servers
- Documentation: Swagger
- Testign: Jest

[**Project CI**](https://github.com/kpi-anton-akh/dic-khrapko-vas/actions) using GitHub Actions

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

Clone the repo:

```bash
git clone https://github.com/kpi-anton-akh/dic-khrapko-vas.git
```

Open project directory and install NPM packages:

```bash
cd dic-khrapko-vas
npm install
```

## Running the application

---

**NOTE**

To run the application in **_<u>production</u>_** mode, it is necessary to replace the value of the **TYPEORM_PASSWORD** parameter in the [config file (.env.production)](.env.production) with the value sent in private messages (Telegram)

---

To run the application in <u>production</u> mode inside a Docker container run:

```bash
docker-compose up
```

Open http://localhost:8080/ to view the API documentation in your browser

---

To run the application in <u>production</u> mode outside a Docker container:

1. Replace the value of the **NEST_HOST** parameter in the [config file (.env.production)](.env.production) with **_`localhost`_**

2. Build the application and start it in production mode:

```bash
npm run build

npm run start:prod
```

Open http://localhost:8080/ to view the API documentation in your browser

---

To run the application locally in **_<u>development</u>_** mode (with local database running in Docker container):

1. Replace the contents of the [docker-compose.yml](docker-compose.yml) file with the contents of the [local.docker-compose.yml](local.docker-compose.yml) file

2. Run development database inside a container:

```bash
docker-compose up
```

3. Run the app in <u>development</u> mode:

```bash
npm run start

OR

# watch mode
npm run start:dev
```

Open http://localhost:8080/ to view the API documentation in your browser

## Testing

To run tests:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Contacts

- Vasyl Khrapko - [@vazzz7zzzok](https://t.me/vazzz7zzzok) - khrapko2002@gmail.com
