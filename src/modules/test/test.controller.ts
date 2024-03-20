import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  //   constructor(private readonly userService: UserService) {}

  // test/id 拼接传参
  @Get(':id')
  findOne(@Param('id') id) {
    return `返回斜杠拼接的参数=${id}`;
  }

  // query是url中?后的字符串，在NestJs里面通过@Query装饰器来取参数
  @Get()
  query(@Query() query) {
    return `返回问号拼接的=${query.id}`;
  }

  // Body对象传参
  @Post()
  bodyArg(@Body() data) {
    return `返回body里面的=${JSON.stringify(data)}`;
  }
}
