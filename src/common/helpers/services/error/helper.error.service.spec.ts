import { Test, TestingModule } from '@nestjs/testing';
import { HelperErrorService } from './helper.error.service';

describe('HelperErrorService', () => {
  let service: HelperErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperErrorService],
    }).compile();

    service = module.get<HelperErrorService>(HelperErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
