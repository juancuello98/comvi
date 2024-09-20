import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core/nest-factory';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
declare const module: any;
async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule,{
    logger:['log','error']
  });
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const config = new DocumentBuilder()
    .setTitle('COMVI - API')
    .setDescription('Proyecto Final ISI UTN')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
  const appAddress = await app.getUrl();

  logger.log(`La aplicación NestJS está corriendo en: ${appAddress}`);
}

bootstrap();
