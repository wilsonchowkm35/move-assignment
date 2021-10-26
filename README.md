# Project Assignment

## Description

API Server built with [Nest](https://github.com/nestjs/nest).

## Configuration
Please copy `.env.production`, `.env.test` and `.env.developement` from `.env.sample` and configure your mongo datbase. Also update the database user and password under `./scripts/config` and `./scripts/test/config`

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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Build & Run in Docker containers
* It will build production database, e2e database and api containers 
```bash
./install.sh
```

### Clean up all containers
```bash
./cleanup.sh
```

### Health Check
```
# should return "ok"
curl http://localhost:4000/health
```

## API routes
| API | Method | Params | Description |
| --- | --- | --- | --- |
| `/sales/record` | POST | @FILE csv | To receive the data in CSV format |
| `/sales/report` | GET | @Query from<br>@Query to<br>@Query page<br>@Query size | To query data with json format<br>e.g., `GET /sales/report?page=1&size=10&from=2021-10-16&to=2021-10-18` |
| `/health` | GET |  | Health check |

## Outandings
1. Support deployment with tag/hash/branch
1. Integrte with vault service for sensitive data, such as database credential
1. Create database generic model layer
1. Support different container orchestrators or container engine, such as docker-compose, kubernetes, openshift, podman...etc

