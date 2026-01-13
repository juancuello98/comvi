import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  algorithm: 'HS256';
  expiresIn: string;
  refreshExpiresIn: string;
}

export const jwtConfig = registerAs('jwt', (): JwtConfig => {
  const secret = process.env.JWT_SECRET;
  
  // Validate JWT_SECRET exists and meets minimum security requirements
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. ' +
      'Please set a secure secret with at least 32 characters.'
    );
  }
  
  if (secret.length < 32) {
    throw new Error(
      `JWT_SECRET must be at least 32 characters long. Current length: ${secret.length}. ` +
      'Use a cryptographically secure random string.'
    );
  }
  
  // Warn about weak secrets in development
  const weakSecrets = [
    'secret',
    'password',
    'jwt-secret',
    'my-secret',
    'test',
    'development',
  ];
  
  if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET appears to contain a weak pattern. ' +
      'Use a cryptographically secure random string in production.'
    );
  }

  return {
    secret,
    algorithm: 'HS256' as const,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  };
});

// Helper to generate a secure secret (for documentation purposes)
export const generateSecureSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const randomValues = new Uint32Array(64);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 64; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

