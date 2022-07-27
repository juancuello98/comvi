import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './authentication/authentication.module';
import { UserModule } from './models/users/user.module';
import { MailModule } from './config/mail/config.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL), 
    MailModule,
    AuthModule, 
    UserModule, 
  ],
  controllers: [AppController]
})
export class AppModule {
}
