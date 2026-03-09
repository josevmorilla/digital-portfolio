const skillController = require('../src/controllers/skillController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  skill: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Skill Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all skills ordered by order', async () => {
      prisma.skill.findMany.mockResolvedValue([{ id: '1', nameEn: 'React' }]);
      await skillController.getAll(req, res);
      expect(prisma.skill.findMany).toHaveBeenCalledWith({ orderBy: { order: 'asc' } });
      expect(res.json).toHaveBeenCalledWith([{ id: '1', nameEn: 'React' }]);
    });

    test('returns 500 on error', async () => {
      prisma.skill.findMany.mockRejectedValue(new Error('DB'));
      await skillController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns skill by ID', async () => {
      req.params.id = 's1';
      prisma.skill.findUnique.mockResolvedValue({ id: 's1', nameEn: 'React' });
      await skillController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 's1', nameEn: 'React' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.skill.findUnique.mockResolvedValue(null);
      await skillController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on error', async () => {
      req.params.id = 's1';
      prisma.skill.findUnique.mockRejectedValue(new Error('DB'));
      await skillController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    test('creates skill with defaults', async () => {
      req.body = { nameEn: 'Node', nameFr: 'Node', category: 'Backend', icon: 'node' };
      prisma.skill.create.mockResolvedValue({ id: 's1', nameEn: 'Node' });
      await skillController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('creates with explicit order', async () => {
      req.body = { nameEn: 'React', nameFr: 'React', category: 'Frontend', icon: 'react', order: 5 };
      prisma.skill.create.mockResolvedValue({ id: 's2' });
      await skillController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('returns 500 on error', async () => {
      req.body = { nameEn: 'X' };
      prisma.skill.create.mockRejectedValue(new Error('DB'));
      await skillController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    test('updates skill', async () => {
      req.params.id = 's1';
      req.body = { nameEn: 'Updated', order: '3' };
      prisma.skill.update.mockResolvedValue({ id: 's1', nameEn: 'Updated' });
      await skillController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 's1', nameEn: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { nameEn: 'X' };
      prisma.skill.update.mockRejectedValue({ code: 'P2025' });
      await skillController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('updates with order undefined', async () => {
      req.params.id = 's1';
      req.body = { nameEn: 'Updated' };
      prisma.skill.update.mockResolvedValue({ id: 's1' });
      await skillController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 's1' });
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 's1';
      req.body = { nameEn: 'X' };
      prisma.skill.update.mockRejectedValue(new Error('DB'));
      await skillController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    test('deletes skill', async () => {
      req.params.id = 's1';
      prisma.skill.delete.mockResolvedValue({});
      await skillController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Skill deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.skill.delete.mockRejectedValue({ code: 'P2025' });
      await skillController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 's1';
      prisma.skill.delete.mockRejectedValue(new Error('DB'));
      await skillController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
