<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## COMVI - backend
Para correr localmente la app es necesario que tengamos un archivo .env con las siguientes variables.

```env
MONGO_URL='mongodb+srv://comvi2022:comviadmin123@cluster0.tplmj.mongodb.net/?retryWrites=true&w=majority'
PORT=3000

# Mailer - transport

TRANSPORT_HOST=smtp.gmail.com
AUTH_USER=comviapp@gmail.com
AUTH_PASS=upmbggzbdkuadnne
DEFAULT_ASUNTO='"COMVI" <noreply@example.com>'
URL_BUTTON=www.google.com.ar
SUBJECT='Bienvenido a COMVI! Estas a un paso de empezar a disfrutar! '
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
