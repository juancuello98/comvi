import { Module } from '@nestjs/common';
import { AuthFirebaseController } from './auth-firebase.controller';
import { AuthFirebaseService } from './auth-firebase.service';

@Module({
  providers: [AuthFirebaseService],
  controllers: [AuthFirebaseController],
  exports: [AuthFirebaseService]
})
export class AuthFirebaseModule {}