import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './models/users/user.module';
import { MailModule } from './config/mail/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './models/trips/trip.module';
import { PasswordTokenModule } from './models/PasswordToken/passwordToken.module';



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
    PasswordTokenModule

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
