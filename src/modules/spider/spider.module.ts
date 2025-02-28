import { Module } from '@nestjs/common';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';

@Module({
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
