const { generateToken, verifyToken } = require('../src/utils/jwt');

// Set a test secret
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

describe('JWT Utilities', () => {
  test('generateToken returns a string', () => {
    const token = generateToken('user-123');
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  test('verifyToken decodes a valid token', () => {
    const token = generateToken('user-456');
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded.id).toBe('user-456');
  });

  test('verifyToken returns null for invalid token', () => {
    const result = verifyToken('invalid.token.here');
    expect(result).toBeNull();
  });

  test('verifyToken returns null for empty string', () => {
    const result = verifyToken('');
    expect(result).toBeNull();
  });
});
