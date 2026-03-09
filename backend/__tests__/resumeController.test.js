const resumeController = require('../src/controllers/resumeController');
const prisma = require('../src/config/database');
const fs = require('node:fs');

jest.mock('../src/config/database', () => ({
  resume: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('node:fs');

describe('Resume Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all resumes', async () => {
      prisma.resume.findMany.mockResolvedValue([{ id: '1' }]);
      await resumeController.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    test('returns 500 on error', async () => {
      prisma.resume.findMany.mockRejectedValue(new Error('DB'));
      await resumeController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getCurrentByLanguage', () => {
    test('returns resume by language', async () => {
      req.params.language = 'en';
      prisma.resume.findFirst.mockResolvedValue({ id: '1', language: 'en' });
      await resumeController.getCurrentByLanguage(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: '1', language: 'en' });
    });

    test('returns 404 when not found', async () => {
      req.params.language = 'de';
      prisma.resume.findFirst.mockResolvedValue(null);
      await resumeController.getCurrentByLanguage(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('download', () => {
    test('downloads resume file', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: '/uploads/resumes/file.pdf', filename: 'resume.pdf',
      });
      fs.existsSync.mockReturnValue(true);

      await resumeController.download(req, res);
      expect(res.download).toHaveBeenCalledWith(expect.stringContaining('file.pdf'), 'resume.pdf');
    });

    test('returns 404 when resume not found', async () => {
      req.params.id = 'none';
      prisma.resume.findUnique.mockResolvedValue(null);
      await resumeController.download(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 404 when file does not exist', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: '/uploads/resumes/missing.pdf', filename: 'resume.pdf',
      });
      fs.existsSync.mockReturnValue(false);

      await resumeController.download(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('upload', () => {
    test('returns 400 when no file uploaded', async () => {
      req.file = null;
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('returns 400 when titles missing', async () => {
      req.file = { originalname: 'resume.pdf', filename: 'file-123.pdf' };
      req.body = {};
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('uploads resume successfully', async () => {
      req.file = { originalname: 'resume.pdf', filename: 'file-123.pdf' };
      req.body = { titleEn: 'Resume', titleFr: 'CV', language: 'en', order: '1' };
      prisma.resume.create.mockResolvedValue({ id: 'r1' });
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update', () => {
    test('updates resume', async () => {
      req.params.id = 'r1';
      req.body = { titleEn: 'Updated', order: '2' };
      prisma.resume.update.mockResolvedValue({ id: 'r1', titleEn: 'Updated' });
      await resumeController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'r1', titleEn: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { titleEn: 'X' };
      prisma.resume.update.mockRejectedValue({ code: 'P2025' });
      await resumeController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes resume and file', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: '/uploads/resumes/file.pdf',
      });
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockReturnValue(undefined);
      prisma.resume.delete.mockResolvedValue({});

      await resumeController.delete(req, res);
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(prisma.resume.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Resume deleted successfully' });
    });

    test('returns 404 when resume not found', async () => {
      req.params.id = 'none';
      prisma.resume.findUnique.mockResolvedValue(null);
      await resumeController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
