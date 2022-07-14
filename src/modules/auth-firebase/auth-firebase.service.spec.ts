import { Test, TestingModule } from '@nestjs/testing';
import { AuthFirebaseService } from './auth-firebase.service';

describe('AuthFirebaseService', () => {
  let service: AuthFirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFirebaseService],
    }).compile();

    service = module.get<AuthFirebaseService>(AuthFirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
