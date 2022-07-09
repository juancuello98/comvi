import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { DbConfigModule } from '../dbconfig/dbconfig.module';

@Module({
  imports: [DbConfigModule],
  controllers: [AuthController],
  providers: [AuthService]
})

export class AuthModule {}
