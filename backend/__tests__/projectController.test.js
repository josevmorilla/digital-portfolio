const projectController = require('../src/controllers/projectController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Project Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all projects', async () => {
      prisma.project.findMany.mockResolvedValue([{ id: '1' }]);
      await projectController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    test('filters featured projects', async () => {
      req.query.featured = 'true';
      prisma.project.findMany.mockResolvedValue([]);
      await projectController.getAll(req, res);
      expect(prisma.project.findMany).toHaveBeenCalledWith({ where: { featured: true }, orderBy: { order: 'asc' } });
    });

    test('returns 500 on error', async () => {
      prisma.project.findMany.mockRejectedValue(new Error('DB'));
      await projectController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns project by ID', async () => {
      req.params.id = 'p1';
      prisma.project.findUnique.mockResolvedValue({ id: 'p1', titleEn: 'Test' });
      await projectController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'p1', titleEn: 'Test' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.project.findUnique.mockResolvedValue(null);
      await projectController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on error', async () => {
      req.params.id = 'p1';
      prisma.project.findUnique.mockRejectedValue(new Error('DB'));
      await projectController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    test('creates project', async () => {
      req.body = { titleEn: 'New', titleFr: 'Nouveau', technologies: ['React'], featured: true, order: '1' };
      prisma.project.create.mockResolvedValue({ id: 'p1', titleEn: 'New' });
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'p1', titleEn: 'New' });
    });

    test('creates with string featured and dates', async () => {
      req.body = {
        titleEn: 'P', titleFr: 'P', featured: 'true',
        startDate: '2020-01-01', endDate: '2024-01-01',
      };
      prisma.project.create.mockResolvedValue({ id: 'p2' });
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('creates with false featured and no dates or order', async () => {
      req.body = { titleEn: 'P', titleFr: 'P', featured: false };
      prisma.project.create.mockResolvedValue({ id: 'p3' });
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('returns 500 on error', async () => {
      req.body = { titleEn: 'X' };
      prisma.project.create.mockRejectedValue(new Error('DB'));
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    test('updates project', async () => {
      req.params.id = 'p1';
      req.body = { titleEn: 'Updated', featured: 'true', order: '2' };
      prisma.project.update.mockResolvedValue({ id: 'p1', titleEn: 'Updated' });
      await projectController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'p1', titleEn: 'Updated' });
    });

    test('returns 404 on P2025 error', async () => {
      req.params.id = 'none';
      req.body = { titleEn: 'Updated' };
      prisma.project.update.mockRejectedValue({ code: 'P2025' });
      await projectController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('updates with all branches', async () => {
      req.params.id = 'p1';
      req.body = {
        titleEn: 'U', featured: undefined, order: undefined,
        technologies: ['JS'], startDate: '2020-01-01', endDate: '2024-01-01',
      };
      prisma.project.update.mockResolvedValue({ id: 'p1' });
      await projectController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'p1' });
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 'p1';
      req.body = { titleEn: 'X' };
      prisma.project.update.mockRejectedValue(new Error('DB'));
      await projectController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    test('deletes project', async () => {
      req.params.id = 'p1';
      prisma.project.delete.mockResolvedValue({});
      await projectController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
    });

    test('returns 404 on P2025 error', async () => {
      req.params.id = 'none';
      prisma.project.delete.mockRejectedValue({ code: 'P2025' });
      await projectController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 'p1';
      prisma.project.delete.mockRejectedValue(new Error('DB'));
      await projectController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
