import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

interface PayloadProps {
  sub: string;
  email: string;
}

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.USER_JWT_SECRET_KEY,
    });
  }
  async validate(payload: PayloadProps) {
    return { userId: payload.sub, email: payload.email };
  }
}
