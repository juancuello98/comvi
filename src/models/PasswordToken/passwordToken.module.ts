import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PasswordTokenController } from './passwordToken.controller';
import { PasswordToken, PasswordTokenSchema } from './passwordToken.schema';
import { PasswordTokenService } from './passwordToken.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PasswordToken.name, schema: PasswordTokenSchema }])],
  controllers: [PasswordTokenController],
  providers: [PasswordTokenService],
  exports: [PasswordTokenService],
})
export class PasswordTokenModule {}


