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
