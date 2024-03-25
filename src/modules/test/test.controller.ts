import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { TestService } from './test.service';

// 定义请求方式、接收参数、返回响应数据
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // 新增数据  Body对象传参
  @Post('create')
  create(@Body() data) {
    return this.testService.create(data);
  }

  // 查询所有
  @Get('list')
  async findAll() {
    return this.testService.findAll();
  }

  // 查询一条数据  test/id 拼接传参
  @Get(':id')
  findOne(@Param('id') id) {
    const res = this.testService.findOne(id);
    console.log('查询的数据', res);
    return res;
  }

  // query是url中?后的字符串，在NestJs里面通过@Query装饰器来取参数
  @Get()
  findData(@Query() query) {
    return this.testService.findData(query);
  }

  // 删除
  @Delete(':id')
  remove(@Param('id') id) {
    return this.testService.remove(id);
  }

  @Post('delete')
  postRemove(@Body() data) {
    return this.testService.remove(data.id);
  }

  // 修改
  @Post('update')
  update(@Body() data) {
    return this.testService.update(data);
  }
}
