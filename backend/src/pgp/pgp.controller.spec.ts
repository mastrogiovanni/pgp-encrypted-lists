import { Test, TestingModule } from '@nestjs/testing';
import { PgpController } from './pgp.controller';

describe('PgpController', () => {
  let controller: PgpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PgpController],
    }).compile();

    controller = module.get<PgpController>(PgpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
