const hobbyController = require('../src/controllers/hobbyController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  hobby: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Hobby Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all hobbies', async () => {
      prisma.hobby.findMany.mockResolvedValue([{ id: '1', nameEn: 'Gaming' }]);
      await hobbyController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: '1', nameEn: 'Gaming' }]);
    });

    test('returns 500 on error', async () => {
      prisma.hobby.findMany.mockRejectedValue(new Error('DB'));
      await hobbyController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns hobby by ID', async () => {
      req.params.id = 'h1';
      prisma.hobby.findUnique.mockResolvedValue({ id: 'h1' });
      await hobbyController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'h1' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.hobby.findUnique.mockResolvedValue(null);
      await hobbyController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on error', async () => {
      req.params.id = 'h1';
      prisma.hobby.findUnique.mockRejectedValue(new Error('DB'));
      await hobbyController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    test('creates hobby', async () => {
      req.body = { nameEn: 'Gaming', nameFr: 'Jeux', technologies: ['Unity'], featured: true };
      prisma.hobby.create.mockResolvedValue({ id: 'h1' });
      await hobbyController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('creates with string featured, dates, and order', async () => {
      req.body = {
        nameEn: 'Hiking', nameFr: 'Rando', featured: 'true', order: 5,
        startDate: '2020-01-01', endDate: '2024-01-01', links: [{ label: 'Blog', url: 'https://x.com' }],
      };
      prisma.hobby.create.mockResolvedValue({ id: 'h2' });
      await hobbyController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('creates with false featured and no dates', async () => {
      req.body = { nameEn: 'Music', nameFr: 'Musique', featured: false };
      prisma.hobby.create.mockResolvedValue({ id: 'h3' });
      await hobbyController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('returns 500 on error', async () => {
      req.body = { nameEn: 'X' };
      prisma.hobby.create.mockRejectedValue(new Error('DB'));
      await hobbyController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    test('updates hobby with date parsing', async () => {
      req.params.id = 'h1';
      req.body = { nameEn: 'Updated', startDate: '2020-01-01', endDate: '', featured: 'true', order: '2' };
      prisma.hobby.update.mockResolvedValue({ id: 'h1', nameEn: 'Updated' });
      await hobbyController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'h1', nameEn: 'Updated' });
    });

    test('updates with undefined dates and featured', async () => {
      req.params.id = 'h1';
      req.body = { nameEn: 'Updated' };
      prisma.hobby.update.mockResolvedValue({ id: 'h1' });
      await hobbyController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'h1' });
    });

    test('updates with actual dates', async () => {
      req.params.id = 'h1';
      req.body = { nameEn: 'Updated', startDate: '2020-01-01', endDate: '2024-01-01', featured: true, order: undefined, links: [], technologies: ['JS'] };
      prisma.hobby.update.mockResolvedValue({ id: 'h1' });
      await hobbyController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'h1' });
    });

    test('updates with empty startDate sets null', async () => {
      req.params.id = 'h1';
      req.body = { nameEn: 'Updated', startDate: '', featured: false };
      prisma.hobby.update.mockResolvedValue({ id: 'h1' });
      await hobbyController.update(req, res);
      expect(prisma.hobby.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ startDate: null, featured: false }),
      }));
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { nameEn: 'X' };
      prisma.hobby.update.mockRejectedValue({ code: 'P2025' });
      await hobbyController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 'h1';
      req.body = { nameEn: 'X' };
      prisma.hobby.update.mockRejectedValue(new Error('DB'));
      await hobbyController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    test('deletes hobby', async () => {
      req.params.id = 'h1';
      prisma.hobby.delete.mockResolvedValue({});
      await hobbyController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hobby deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.hobby.delete.mockRejectedValue({ code: 'P2025' });
      await hobbyController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 'h1';
      prisma.hobby.delete.mockRejectedValue(new Error('DB'));
      await hobbyController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
