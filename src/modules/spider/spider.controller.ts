import { Controller, Get } from '@nestjs/common';
import { SpiderService } from './spider.service';

@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  // 百度热搜，微博热搜，知乎热搜，抖音热搜，头条热搜，小红书热搜，基金相关

  @Get('baidu/hotsearch')
  async getBaiduHotSearch() {
    const data = await this.spiderService.getBaiduHotSearch('baidu');
    return data;
  }
  @Get('weibo/hotsearch')
  async getWeiboHotSearch() {
    const data = await this.spiderService.getBaiduHotSearch('weibo');
    return data;
  }
  @Get('zhihu/hotsearch')
  async getZhihuHotSearch() {
    const data = await this.spiderService.getBaiduHotSearch('zhihu');
    return data;
  }
  @Get('douyin/hotsearch')
  async getDouyinHotSearch() {
    const data = await this.spiderService.getBaiduHotSearch('douyin');
    return data;
  }
}
