import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './models/users/user.module';
import { MailModule } from './mail/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './models/trips/trip.module';
import { CommonModule } from './common/common.module';
import { VehiclesModule } from './models/vehicles/vehicles.module';
import { RequestModule } from './models/requests/request.module';
import { ValuationsModule } from './models/valuations/valuations.module';



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
    RequestModule,
    ValuationsModule

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
