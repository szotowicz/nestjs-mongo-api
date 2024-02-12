# NestJS-Mongo-API

## Flow
1. Use endpoint POST "/api/v1/queue" and upload file. In response you will receive "id" of task.
2. New task is added to queue.
3. Use endpoint GET "/api/v1/queue/{id}".
4. Task is processed from queue.
    1. File is processed record by record.
    2. Row is validated.
    3. If a reservation with such an ID does not exist, the data is updated.
    4. Otherwise, the data is updated.
5. Task in database is updated with details.

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
cd local-development
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
* unit tests
* support for large .xlsx files
* include time zones (date parsing and unification)
* improve phone parsing (class-transformer), exclude phone prefix
