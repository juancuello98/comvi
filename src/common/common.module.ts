import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestHelper } from './helpers/request.helper';
import { AuthFirebaseMiddleware } from './middleware/auth-firebase.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
  ],
  controllers: [],
  providers: [
      RequestHelper,
      JwtAuthGuard,
      AuthFirebaseMiddleware,
      JwtStrategy
  ],
  exports: [
      RequestHelper
  ]
})

export class CommonModule {
}
