import { Test, TestingModule } from '@nestjs/testing';
import { ScoringrecordController } from './scoringrecord.controller';

describe('ScoringrecordController', () => {
  let controller: ScoringrecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoringrecordController],
    }).compile();

    controller = module.get<ScoringrecordController>(ScoringrecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
