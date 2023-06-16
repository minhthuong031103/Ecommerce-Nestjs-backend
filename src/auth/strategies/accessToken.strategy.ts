import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayLoad } from '../types';
@Injectable() //name of the strategy
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(public config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(payload: JwtPayLoad) {
    return payload;
  }
}
