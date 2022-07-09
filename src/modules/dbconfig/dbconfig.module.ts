import { Module } from '@nestjs/common';
import { DbconfigService } from './dbconfig.service';
import { User, UserSchema ,Register, RegisterSchema} from '../dbconfig/schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Register.name, schema: RegisterSchema }])
  ],
  controllers: [],
  providers: [DbconfigService],
  exports: [DbconfigService]
})

export class DbConfigModule {}
