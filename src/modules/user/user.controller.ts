import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 登录
  @Post('login')
  login(@Body() user) {
    return this.userService.login(user);
  }

  // 退出
  @Get('logout')
  logout() {
    return { status: 200 };
  }
}
