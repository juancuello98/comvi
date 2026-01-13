import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './models/users/user.module';
import { MailModule } from './mail/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './models/trips/trip.module';
import { CommonModule } from './common/common.module';
import { VehiclesModule } from './models/vehicles/vehicles.module';
import { ValuationsModule } from './models/valuations/valuations.module';
import { RequestModule } from './models/requests/request.module';
import { jwtConfig } from './authentication/jwt/jwt.config';
import { mongodbConfig, mongooseConnectionFactory } from './database/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        ...configService.get('mongodb.options'),
        ...mongooseConnectionFactory,
      }),
      inject: [ConfigService],
    }),
    MailModule,
    AuthModule,
    UserModule,
    TripModule,
    CommonModule,
    VehiclesModule,
    ValuationsModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
