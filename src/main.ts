import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const logger = new Logger();

  mongoose.set('strictPopulate', false);

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error']
  });

  // Inicializa Firebase
  // admin.initializeApp({
  //   credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
  // });

  //Inicializa el cliente de Google Maps
  // export const googleMapsClient = createClient({
  //   key: process.env.GOOGLE_MAPS_API_KEY,
  //   Promise: Promise
  // });

  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  
  const configDoc = new DocumentBuilder()
    .setTitle('COMVI - API')
    .setDescription('Proyecto Final ISI UTN')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .build();
  
    const document = SwaggerModule.createDocument(app, configDoc); 
    
    // SwaggerModule.setup('/', app, document);
    // cosnt swaggerOptions = new DocumentBuilder()
    // const document = SwaggerModule.createDocument(app, documentSwagger as OpenAPIObject );
    SwaggerModule.setup('/', app, document, {jsonDocumentUrl: '/swagger/json', customSiteTitle: 'COMVI - API'});
    // SwaggerModule.setup('swagger', app, document, {explorer:true});

  await app.listen(process.env.PORT || 3000);
  const appAddress = await app.getUrl();

  logger.log(`La aplicación NestJS está corriendo en: ${appAddress}`);
}

bootstrap();
