import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from 'src/models/users/interfaces/user-details.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate({ _id, email, name, lastname }: UserDTO) {
    return { userId: _id, email, full_name: `${name} ${lastname}` };
  }
}
