import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../models/users/user.module';
import { JwtAuthGuard } from '../authentication/jwt/jwt-auth.guard';
import { RequestHelper } from './helpers/http/request.helper';
import { ResponseHelper } from './helpers/http/response.helper';
import { JwtStrategy } from '../authentication/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    ResponseHelper,
    RequestHelper,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [ResponseHelper, RequestHelper],
})
export class CommonModule {}
