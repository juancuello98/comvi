import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants/settings';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MailModule } from 'src/config/mail/config.module';
import { UserModule } from 'src/models/users/user.module';
import { PasswordTokenModule } from 'src/models/passwordToken/passwordToken.module'; 

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule,
    PasswordTokenModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '180s' },
    }),  
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})

export class AuthModule {}
