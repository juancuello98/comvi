import { Module } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constant';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from 'src/models/users/user.module';
import { MailModule } from 'src/mail/config.module';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule,
    CommonModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, //TODO: Cambiar esto que sea configurable
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
