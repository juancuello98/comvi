<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## COMVI - backend
Para correr localmente la app es necesario que tengamos un archivo .env con las siguientes variables.

```env
MONGO_URL=
PORT=

# Mailer - transport

TRANSPORT_HOST=
AUTH_USER=
AUTH_PASS=
DEFAULT_ASUNTO=
URL_BUTTON=
SUBJECT=

```
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Instalacion

```bash
$ npm install
```

## Correr la app localmente

```bash
# development
$ npm run start

# watch mode, correr la app y al hacer cambios y guardarlos "escucha" estos cambios y vuelve a correr
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Flowchart
### Usuario Conductor
::: mermaid
graph TD;
   LOGIN --> USER_DRIVER 
   USER_DRIVER --> CREATE_TRIP
   USER_DRIVER --> GET_TRIP
   GET_TRIP --> UPDATE_TRIP
   GET_TRIP --> CANCEL_TRIP
   GET_TRIP --> INIT_TRIP

   CANCEL_TRIP --> NOTIFY
   UPDATE_TRIP --> NOTIFY
   INIT_TRIP --> NOTIFY
   GET_TRIP --> GET_REQUESTS
   GET_REQUESTS --> ACCEPT_REQUEST
   GET_REQUESTS --> DENIED_REQUEST
   ACCEPT_REQUEST --> CREATE_BOOKING
   CREATE_BOOKING --> NOTIFY
   DENIED_REQUEST --> NOTIFY
   GET_TRIP --> GET_BOOKING
   GET_BOOKING --> CANCEL_BOOKING
   CANCEL_BOOKING --> NOTIFY
:::

### Usuario Pasajero
::: mermaid
graph TD;
   LOGIN --> USER_PASSENGER
:::
