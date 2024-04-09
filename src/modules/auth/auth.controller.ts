import { Controller, Post, Body, Get, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录
  @Post('login')
  async login(@Body() body: any) {
    // const payload = { username: body.username, sub: body.userId };
    // return {
    //   access_token: await this.authService.generateAccessToken(payload),
    // };
    return await this.authService.generateAccessToken(body);
  }

  // 获取用户信息
  @UseGuards(AuthGuard('jwt')) // 添加后需要token验证请求
  @Get('userInfo')
  findAll() {
    return {
      code: 200,
    };
  }
}
