const educationController = require('../src/controllers/educationController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  education: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Education Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all education records', async () => {
      prisma.education.findMany.mockResolvedValue([{ id: '1' }]);
      await educationController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    test('returns 500 on error', async () => {
      prisma.education.findMany.mockRejectedValue(new Error('DB'));
      await educationController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns education by ID', async () => {
      req.params.id = 'e1';
      prisma.education.findUnique.mockResolvedValue({ id: 'e1' });
      await educationController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'e1' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.education.findUnique.mockResolvedValue(null);
      await educationController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {
    test('creates education record', async () => {
      req.body = {
        institutionEn: 'MIT', institutionFr: 'MIT', degreeEn: 'BS', degreeFr: 'BS',
        fieldEn: 'CS', fieldFr: 'CS', startDate: '2020-01-01', current: true,
      };
      prisma.education.create.mockResolvedValue({ id: 'e1' });
      await educationController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update', () => {
    test('updates education record', async () => {
      req.params.id = 'e1';
      req.body = { institutionEn: 'Updated', order: '2' };
      prisma.education.update.mockResolvedValue({ id: 'e1', institutionEn: 'Updated' });
      await educationController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'e1', institutionEn: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { institutionEn: 'X' };
      prisma.education.update.mockRejectedValue({ code: 'P2025' });
      await educationController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes education record', async () => {
      req.params.id = 'e1';
      prisma.education.delete.mockResolvedValue({});
      await educationController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Education record deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.education.delete.mockRejectedValue({ code: 'P2025' });
      await educationController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
