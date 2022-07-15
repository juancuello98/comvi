import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { DbConfigModule } from '../dbconfig/dbconfig.module';
import { AuthFirebaseModule } from '../auth-firebase/auth-firebase.module';
import { AuthFirebaseService } from '../auth-firebase/auth-firebase.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DbConfigModule, 
    AuthFirebaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '180s' },
    }),  
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthFirebaseService, JwtStrategy]
})

export class AuthModule {}
