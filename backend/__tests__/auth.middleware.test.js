const authMiddleware = require('../src/middleware/auth');
const { verifyToken } = require('../src/utils/jwt');
const prisma = require('../src/config/database');

// Mock dependencies
jest.mock('../src/utils/jwt');
jest.mock('../src/config/database', () => ({
  user: { findUnique: jest.fn() },
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('returns 401 when no authorization header', async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    verifyToken.mockReturnValue(null);

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });

  test('returns 401 when user not found', async () => {
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockReturnValue({ id: 'user-123' });
    prisma.user.findUnique.mockResolvedValue(null);

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  test('calls next and sets req.user when token is valid', async () => {
    req.headers.authorization = 'Bearer valid-token';
    const mockUser = { id: 'user-123', email: 'test@test.com', name: 'Test' };
    verifyToken.mockReturnValue({ id: 'user-123' });
    prisma.user.findUnique.mockResolvedValue(mockUser);

    await authMiddleware(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 401 when an error is thrown', async () => {
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockImplementation(() => { throw new Error('boom'); });

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
  });
});
