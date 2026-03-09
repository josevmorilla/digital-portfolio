const workExperienceController = require('../src/controllers/workExperienceController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  workExperience: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Work Experience Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all work experiences', async () => {
      prisma.workExperience.findMany.mockResolvedValue([{ id: '1' }]);
      await workExperienceController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    test('returns 500 on error', async () => {
      prisma.workExperience.findMany.mockRejectedValue(new Error('DB'));
      await workExperienceController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns experience by ID', async () => {
      req.params.id = 'w1';
      prisma.workExperience.findUnique.mockResolvedValue({ id: 'w1' });
      await workExperienceController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'w1' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.workExperience.findUnique.mockResolvedValue(null);
      await workExperienceController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {
    test('creates work experience', async () => {
      req.body = {
        companyEn: 'Google', companyFr: 'Google', positionEn: 'Dev', positionFr: 'Dev',
        startDate: '2020-01-01', current: 'true',
      };
      prisma.workExperience.create.mockResolvedValue({ id: 'w1' });
      await workExperienceController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update', () => {
    test('updates work experience', async () => {
      req.params.id = 'w1';
      req.body = { companyEn: 'Updated', order: '2' };
      prisma.workExperience.update.mockResolvedValue({ id: 'w1', companyEn: 'Updated' });
      await workExperienceController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'w1', companyEn: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { companyEn: 'X' };
      prisma.workExperience.update.mockRejectedValue({ code: 'P2025' });
      await workExperienceController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes work experience', async () => {
      req.params.id = 'w1';
      prisma.workExperience.delete.mockResolvedValue({});
      await workExperienceController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Work experience deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.workExperience.delete.mockRejectedValue({ code: 'P2025' });
      await workExperienceController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
