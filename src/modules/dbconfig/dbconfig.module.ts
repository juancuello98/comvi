import { Module } from '@nestjs/common';
import { MongoService, TypeOrmService } from './dbconfig.service';
import { User, UserSchema} from '../dbconfig/schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }])],
  controllers: [],
  providers: [MongoService, TypeOrmService],
  exports: [MongoService, TypeOrmService]
})

export class DbConfigModule {}
