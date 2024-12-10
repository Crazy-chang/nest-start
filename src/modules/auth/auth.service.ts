import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
type User = {
  userName: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * 用户登录
   * @param user
   */
  login({ userName, password }) {
    console.log(userName, password);
    if (!userName || !password) {
      return new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    if (userName != 'admin') {
      return new HttpException('账号不存在', -1);
    }
    if (password != '666666') {
      return new HttpException('密码错误', -1);
    }
    return {
      status: 200,
      userName,
    };
  }
  // 创建token
  async generateAccessToken(payload: User) {
    console.log('登陆信息', payload);
    const data: any = await this.login(payload);
    // const data: any = await this.userService.login(payload);
    if (data.status === 200) {
      const token = await this.jwtService.sign({
        id: data.userName,
        username: data.userName,
      });

      return {
        code: 200,
        data: {
          token: `Bearer ${token}`,
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
