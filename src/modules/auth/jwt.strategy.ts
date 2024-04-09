import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';

// JWT策略
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //对前端传递来的token进行解析
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  // 验证token
  async validate(payload: { id: string; nick_name: string }) {
    return {
      id: payload.id,
      nickname: payload.nick_name,
    };
  }
}
