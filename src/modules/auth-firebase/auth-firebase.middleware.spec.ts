import { AuthFirebaseMiddleware } from './auth-firebase.middleware';

describe('AuthFirebaseMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthFirebaseMiddleware()).toBeDefined();
  });
});
