import { Test, TestingModule } from '@nestjs/testing';
import { InjestionController } from './injestion.controller';

describe('InjestionController', () => {
  let controller: InjestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InjestionController],
    }).compile();

    controller = module.get<InjestionController>(InjestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
