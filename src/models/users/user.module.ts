import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';

import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { IUSER_REPOSITORY } from './repository/constants/user.repository.constant';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
    PersonModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository,  {
    provide: IUSER_REPOSITORY,
    useClass: UserRepository,
  }],
  exports: [UserService, UserRepository,IUSER_REPOSITORY  ],
})
export class UserModule {}
