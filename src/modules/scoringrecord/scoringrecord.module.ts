import { Module } from '@nestjs/common';
import { ScoringrecordController } from './scoringrecord.controller';
import { ScoringrecordService } from './scoringrecord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntity } from './entity/scoringrecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreEntity])],
  controllers: [ScoringrecordController],
  providers: [ScoringrecordService],
})
export class ScoringrecordModule {}