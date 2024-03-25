import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entity/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])], // 导入存储库后可在service使用
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
