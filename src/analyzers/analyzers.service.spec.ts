import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzersService } from './analyzers.service';

describe('AnalyzersService', () => {
  let service: AnalyzersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzersService],
    }).compile();

    service = module.get<AnalyzersService>(AnalyzersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
