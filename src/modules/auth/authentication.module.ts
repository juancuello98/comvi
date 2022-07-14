import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { DbConfigModule } from '../dbconfig/dbconfig.module';
import { AuthFirebaseModule } from '../auth-firebase/auth-firebase.module';
import { AuthFirebaseService } from '../auth-firebase/auth-firebase.service';

@Module({
  imports: [DbConfigModule, AuthFirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFirebaseService]
})

export class AuthModule {}
