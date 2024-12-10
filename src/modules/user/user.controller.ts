import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 登录
  @Post('login')
  login(@Body() user) {
    return this.userService.login(user);
  }

  // 前端传token参数
  // headers: { Authorization: token }
  // 获取用户信息
  @UseGuards(AuthGuard('jwt')) // 添加后需要token验证请求
  @Get('userInfo')
  findAll() {
    return this.userService.userMsg();
  }
}
