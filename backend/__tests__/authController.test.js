const bcrypt = require('bcryptjs');
const authController = require('../src/controllers/authController');
const prisma = require('../src/config/database');
const { generateToken } = require('../src/utils/jwt');

jest.mock('../src/config/database', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('../src/utils/jwt');
jest.mock('bcryptjs');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { id: 'user-1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('returns 401 when user not found', async () => {
      req.body = { email: 'no@user.com', password: 'pass' };
      prisma.user.findUnique.mockResolvedValue(null);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    test('returns 401 when password is wrong', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    test('returns token and user on success', async () => {
      req.body = { email: 'test@test.com', password: 'correct' };
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test', password: 'hashed' };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('mock-token');

      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mock-token',
        user: { id: '1', email: 'test@test.com', name: 'Test' },
      });
    });

    test('returns 500 on error', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      prisma.user.findUnique.mockRejectedValue(new Error('DB error'));

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMe', () => {
    test('returns current user', async () => {
      req.user = { id: '1', email: 'test@test.com', name: 'Test' };
      await authController.getMe(req, res);
      expect(res.json).toHaveBeenCalledWith({ user: req.user });
    });
  });

  describe('changePassword', () => {
    test('returns 401 when current password is wrong', async () => {
      req.body = { currentPassword: 'wrong', newPassword: 'new123' };
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await authController.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Current password is incorrect' });
    });

    test('changes password successfully', async () => {
      req.body = { currentPassword: 'correct', newPassword: 'new123' };
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('new-hashed');
      prisma.user.update.mockResolvedValue({});

      await authController.changePassword(req, res);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password: 'new-hashed' },
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });

    test('returns 500 on error', async () => {
      req.body = { currentPassword: 'x', newPassword: 'y' };
      prisma.user.findUnique.mockRejectedValue(new Error('DB error'));

      await authController.changePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
