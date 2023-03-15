import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './models/users/user.module';
import { MailModule } from './config/mail/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './models/trips/trip.module';
import { CommonModule } from './common/common.module';
import { VehiclesModule } from './models/vehicles/vehicles.module';
import { RequestModule } from './models/requests/request.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL), 
    MailModule,
    AuthModule, 
    UserModule,
    TripModule,
    CommonModule,
    VehiclesModule,
    RequestModule

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
