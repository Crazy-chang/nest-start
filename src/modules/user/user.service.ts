import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  /**
   * 用户登录
   * @param user
   */
  login({ name, password }) {
    if (!name || !password) {
      return new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    if (name != 'admin') {
      return new HttpException('账号不存在', -1);
    }
    if (password != '666666') {
      return new HttpException('密码错误', -1);
    }
    return {
      status: 200,
      data: {
        token: '66666666666',
        userName: name,
      },
    };
  }
}
