import { Controller, Get } from '@nestjs/common';
import { ScoringrecordService } from './scoringrecord.service';

@Controller('scoringrecord')
export class ScoringrecordController {
  constructor(private readonly scoringrecordService: ScoringrecordService) {}

  // 查询所有记录
  @Get('list')
  async findAll() {
    return this.scoringrecordService.findAll();
  }
}
