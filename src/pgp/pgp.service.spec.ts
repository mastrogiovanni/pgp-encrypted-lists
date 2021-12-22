import { Test, TestingModule } from '@nestjs/testing';
import { PgpService } from './pgp.service';

describe('PgpService', () => {
  let service: PgpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgpService],
    }).compile();

    service = module.get<PgpService>(PgpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
