import { Test, TestingModule } from '@nestjs/testing';
import { InjestionService } from './injestion.service';

describe('InjestionService', () => {
  let service: InjestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InjestionService],
    }).compile();

    service = module.get<InjestionService>(InjestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
