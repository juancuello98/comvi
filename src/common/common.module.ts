import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/models/users/user.service';
import { UserModule } from '../models/users/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestHelper } from './helpers/request.helper';
import { ResponseHelper } from './helpers/response.helper';
import { AuthFirebaseMiddleware } from './middleware/auth-firebase.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal : true,
    }),
  ],
  controllers: [],
  providers: [
      ResponseHelper,
      RequestHelper,
      JwtAuthGuard,
      AuthFirebaseMiddleware,
      JwtStrategy
  ],
  exports: [
      ResponseHelper,
      RequestHelper,
      UserModule
  ]
})

export class CommonModule {
}
