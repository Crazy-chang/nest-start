import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 创建token
  async generateAccessToken(payload: any) {
    const data: any = await this.userService.login(payload);
    if (data.status === 200) {
      const token = await this.jwtService.sign({
        id: data.userName,
        username: data.userName,
      });

      return {
        code: 200,
        data: {
          token,
        },
      };
    } else {
      return {
        code: data.status,
        message: data.response,
        data: null,
      };
    }
  }
}
