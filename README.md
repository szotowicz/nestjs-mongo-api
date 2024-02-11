# NestJS-Mongo-API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Local development environment

```bash
cd mongo-local
docker compose build
```

After images are property built, start all service with single command:

```bash
docker compose up -d
```

## API definition
http://localhost:8080/docs



## TODO:
* authentication mechanism
* scheduler for regular deletion of uploaded files (processed or incorrect)
