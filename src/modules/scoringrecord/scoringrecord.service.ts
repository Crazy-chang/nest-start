import { Injectable } from '@nestjs/common';
import { ScoreEntity } from './entity/scoringrecord.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScoringrecordService {
  constructor(
    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,
  ) {}
  async findAll() {
    return await this.scoreRepository.find();
  }
}
