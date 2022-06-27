import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //TODO: Documentacion de Swagger
  const config = new DocumentBuilder()
    .setTitle('COMVI - REST API')
    .setDescription('REST API - Proyecto Final ISI UTN')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('comvi/docs', app, document);

  //TODO: Para que se active el uso de pipes

  app.useGlobalPipes( new ValidationPipe());
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
