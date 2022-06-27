import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    MongooseModule.forRoot('mongodb+srv://comvi2022:comviadmin123@cluster0.tplmj.mongodb.net/?retryWrites=true&w=majority')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
