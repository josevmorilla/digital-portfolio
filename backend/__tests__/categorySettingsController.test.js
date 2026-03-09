const categorySettingsController = require('../src/controllers/categorySettingsController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  skill: { findMany: jest.fn() },
  categorySettings: {
    findMany: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
    upsert: jest.fn(),
  },
}));

describe('Category Settings Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('auto-creates settings for new categories', async () => {
      prisma.skill.findMany.mockResolvedValue([
        { category: 'Frontend' },
        { category: 'Backend' },
      ]);
      prisma.categorySettings.findMany
        .mockResolvedValueOnce([{ id: '1', category: 'Frontend' }]) // existing
        .mockResolvedValueOnce([{ id: '1', category: 'Frontend' }, { id: '2', category: 'Backend' }]); // final
      prisma.categorySettings.createMany.mockResolvedValue({ count: 1 });

      await categorySettingsController.getAll(req, res);
      expect(prisma.categorySettings.createMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test('auto-removes settings for empty categories', async () => {
      prisma.skill.findMany.mockResolvedValue([{ category: 'Frontend' }]);
      prisma.categorySettings.findMany
        .mockResolvedValueOnce([
          { id: '1', category: 'Frontend' },
          { id: '2', category: 'Obsolete' },
        ])
        .mockResolvedValueOnce([{ id: '1', category: 'Frontend' }]);

      await categorySettingsController.getAll(req, res);
      expect(prisma.categorySettings.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['2'] } },
      });
    });

    test('returns 500 on error', async () => {
      prisma.skill.findMany.mockRejectedValue(new Error('DB'));
      await categorySettingsController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateAll', () => {
    test('upserts all settings', async () => {
      req.body = {
        settings: [
          { category: 'Frontend', displayOrder: '0', speed: '4000' },
          { category: 'Backend', displayOrder: '1', speed: '5000' },
        ],
      };
      prisma.categorySettings.upsert.mockResolvedValue({});
      prisma.categorySettings.findMany.mockResolvedValue([]);

      await categorySettingsController.updateAll(req, res);
      expect(prisma.categorySettings.upsert).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalled();
    });

    test('returns 400 when settings is not an array', async () => {
      req.body = { settings: 'not-array' };
      await categorySettingsController.updateAll(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'settings must be an array' });
    });

    test('returns 500 on error', async () => {
      req.body = { settings: [{ category: 'X', displayOrder: '0', speed: '0' }] };
      prisma.categorySettings.upsert.mockRejectedValue(new Error('DB'));
      await categorySettingsController.updateAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
