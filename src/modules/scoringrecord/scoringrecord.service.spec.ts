import { Test, TestingModule } from '@nestjs/testing';
import { ScoringrecordService } from './scoringrecord.service';

describe('ScoringrecordService', () => {
  let service: ScoringrecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringrecordService],
    }).compile();

    service = module.get<ScoringrecordService>(ScoringrecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
