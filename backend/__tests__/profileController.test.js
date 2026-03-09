const profileController = require('../src/controllers/profileController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  profile: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Profile Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('get', () => {
    test('returns profile', async () => {
      const profile = { id: '1', nameEn: 'Jose' };
      prisma.profile.findFirst.mockResolvedValue(profile);

      await profileController.get(req, res);
      expect(res.json).toHaveBeenCalledWith(profile);
    });

    test('returns null when no profile exists', async () => {
      prisma.profile.findFirst.mockResolvedValue(null);

      await profileController.get(req, res);
      expect(res.json).toHaveBeenCalledWith(null);
    });

    test('returns 500 on error', async () => {
      prisma.profile.findFirst.mockRejectedValue(new Error('DB error'));

      await profileController.get(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('upsert', () => {
    test('creates profile when none exists', async () => {
      prisma.profile.findFirst.mockResolvedValue(null);
      const newProfile = { id: '1', nameEn: 'Jose' };
      prisma.profile.create.mockResolvedValue(newProfile);
      req.body = { nameEn: 'Jose', nameFr: 'Jose', titleEn: 'Dev', titleFr: 'Dev', bioEn: 'Bio', bioFr: 'Bio' };

      await profileController.upsert(req, res);
      expect(prisma.profile.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(newProfile);
    });

    test('updates profile when one exists', async () => {
      const existing = { id: '1', nameEn: 'Old' };
      prisma.profile.findFirst.mockResolvedValue(existing);
      const updated = { id: '1', nameEn: 'Jose' };
      prisma.profile.update.mockResolvedValue(updated);
      req.body = { nameEn: 'Jose', nameFr: 'Jose', titleEn: 'Dev', titleFr: 'Dev', bioEn: 'Bio', bioFr: 'Bio' };

      await profileController.upsert(req, res);
      expect(prisma.profile.update).toHaveBeenCalledWith({ where: { id: '1' }, data: expect.any(Object) });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('returns 500 on error', async () => {
      prisma.profile.findFirst.mockRejectedValue(new Error('DB error'));
      req.body = { nameEn: 'Jose' };

      await profileController.upsert(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
