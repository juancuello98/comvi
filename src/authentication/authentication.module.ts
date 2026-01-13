import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from 'src/models/users/user.module';
import { MailModule } from 'src/mail/config.module';
import { CommonModule } from '@/common/common.module';
import { jwtConfig } from './jwt/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    CommonModule,
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        const expiresIn = configService.get<string>('jwt.expiresIn') || '7d';
        
        return {
          secret,
          signOptions: { 
            algorithm: 'HS256',
            expiresIn: expiresIn as any,
          },
          verifyOptions: {
            algorithms: ['HS256'],
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
