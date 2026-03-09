const contactInfoController = require('../src/controllers/contactInfoController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  contactInfo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Contact Info Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: undefined };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns only visible items for public', async () => {
      prisma.contactInfo.findMany.mockResolvedValue([]);
      await contactInfoController.getAll(req, res);
      expect(prisma.contactInfo.findMany).toHaveBeenCalledWith({
        where: { visible: true }, orderBy: { order: 'asc' },
      });
    });

    test('returns all items for admin', async () => {
      req.user = { id: '1' };
      prisma.contactInfo.findMany.mockResolvedValue([]);
      await contactInfoController.getAll(req, res);
      expect(prisma.contactInfo.findMany).toHaveBeenCalledWith({
        where: {}, orderBy: { order: 'asc' },
      });
    });

    test('returns 500 on error', async () => {
      prisma.contactInfo.findMany.mockRejectedValue(new Error('DB'));
      await contactInfoController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns contact info by ID', async () => {
      req.params.id = 'c1';
      prisma.contactInfo.findUnique.mockResolvedValue({ id: 'c1' });
      await contactInfoController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'c1' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.contactInfo.findUnique.mockResolvedValue(null);
      await contactInfoController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {
    test('creates contact info with defaults', async () => {
      req.body = { type: 'email', label: 'Email', value: 'test@test.com' };
      prisma.contactInfo.create.mockResolvedValue({ id: 'c1' });
      await contactInfoController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update', () => {
    test('updates contact info', async () => {
      req.params.id = 'c1';
      req.body = { label: 'Updated', visible: 'true', order: '2' };
      prisma.contactInfo.update.mockResolvedValue({ id: 'c1', label: 'Updated' });
      await contactInfoController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'c1', label: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { label: 'X' };
      prisma.contactInfo.update.mockRejectedValue({ code: 'P2025' });
      await contactInfoController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes contact info', async () => {
      req.params.id = 'c1';
      prisma.contactInfo.delete.mockResolvedValue({});
      await contactInfoController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact info deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.contactInfo.delete.mockRejectedValue({ code: 'P2025' });
      await contactInfoController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
