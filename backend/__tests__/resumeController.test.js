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

    test('handles old /uploads/ path when file exists at old location', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: '/uploads/old-resume.pdf', filename: 'resume.pdf',
      });
      fs.existsSync.mockImplementation((p) => p.includes('old-resume.pdf') && !p.includes('resumes'));
      await resumeController.download(req, res);
      expect(res.download).toHaveBeenCalledWith(expect.stringContaining('old-resume.pdf'), 'resume.pdf');
    });

    test('handles old /uploads/ path fallback to resumes subdir', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: '/uploads/old-resume.pdf', filename: 'resume.pdf',
      });
      // First existsSync (old path) returns false, second (new resumes subdir) returns true, third (final check) returns true
      fs.existsSync
        .mockReturnValueOnce(false) // old path doesn't exist
        .mockReturnValueOnce(true); // final filePath check exists
      await resumeController.download(req, res);
      expect(res.download).toHaveBeenCalledWith(expect.stringContaining('resumes'), 'resume.pdf');
    });

    test('handles non-standard path', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({
        id: 'r1', fileUrl: 'some/other/path.pdf', filename: 'resume.pdf',
      });
      fs.existsSync.mockReturnValue(true);
      await resumeController.download(req, res);
      expect(res.download).toHaveBeenCalledWith(expect.stringContaining('path.pdf'), 'resume.pdf');
    });

    test('returns 500 on database error', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockRejectedValue(new Error('DB error'));
      await resumeController.download(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('returns 500 on getCurrentByLanguage error', async () => {
      req.params.language = 'en';
      prisma.resume.findFirst.mockRejectedValue(new Error('DB'));
      await resumeController.getCurrentByLanguage(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
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

    test('uploads with descriptions and default language/order', async () => {
      req.file = { originalname: 'resume.pdf', filename: 'file-123.pdf' };
      req.body = { titleEn: 'Resume', titleFr: 'CV', descriptionEn: 'Desc', descriptionFr: 'Desc FR' };
      prisma.resume.create.mockResolvedValue({ id: 'r2' });
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('returns 400 when only titleEn provided', async () => {
      req.file = { originalname: 'resume.pdf', filename: 'file-123.pdf' };
      req.body = { titleEn: 'Resume' };
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
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

    test('updates with descriptions and language', async () => {
      req.params.id = 'r1';
      req.body = { titleEn: 'U', titleFr: 'U', descriptionEn: 'D', descriptionFr: '', language: 'fr', order: undefined };
      prisma.resume.update.mockResolvedValue({ id: 'r1' });
      await resumeController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'r1' });
    });

    test('updates with empty descriptionEn and truthy descriptionFr', async () => {
      req.params.id = 'r1';
      req.body = { descriptionEn: '', descriptionFr: 'Description FR' };
      prisma.resume.update.mockResolvedValue({ id: 'r1' });
      await resumeController.update(req, res);
      expect(prisma.resume.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ titleEn: undefined, descriptionEn: null, descriptionFr: 'Description FR' }),
      }));
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { titleEn: 'X' };
      prisma.resume.update.mockRejectedValue({ code: 'P2025' });
      await resumeController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic error', async () => {
      req.params.id = 'r1';
      req.body = { titleEn: 'X' };
      prisma.resume.update.mockRejectedValue(new Error('DB'));
      await resumeController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
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

    test('deletes resume with old /uploads/ path (file exists at old location)', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({ id: 'r1', fileUrl: '/uploads/old.pdf' });
      fs.existsSync.mockImplementation((p) => p.includes('old.pdf') && !p.includes('resumes'));
      fs.unlinkSync.mockReturnValue(undefined);
      prisma.resume.delete.mockResolvedValue({});
      await resumeController.delete(req, res);
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Resume deleted successfully' });
    });

    test('deletes resume with old /uploads/ path (fallback to resumes subdir)', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({ id: 'r1', fileUrl: '/uploads/old.pdf' });
      fs.existsSync
        .mockReturnValueOnce(false) // old path doesn't exist
        .mockReturnValueOnce(true); // new resumes subdir path exists
      fs.unlinkSync.mockReturnValue(undefined);
      prisma.resume.delete.mockResolvedValue({});
      await resumeController.delete(req, res);
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    test('deletes resume with non-standard path', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({ id: 'r1', fileUrl: 'custom/path.pdf' });
      fs.existsSync.mockReturnValue(false);
      prisma.resume.delete.mockResolvedValue({});
      await resumeController.delete(req, res);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Resume deleted successfully' });
    });

    test('returns 404 on P2025 error during delete', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({ id: 'r1', fileUrl: '/uploads/resumes/f.pdf' });
      fs.existsSync.mockReturnValue(false);
      prisma.resume.delete.mockRejectedValue({ code: 'P2025' });
      await resumeController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on generic delete error', async () => {
      req.params.id = 'r1';
      prisma.resume.findUnique.mockResolvedValue({ id: 'r1', fileUrl: '/uploads/resumes/f.pdf' });
      fs.existsSync.mockReturnValue(false);
      prisma.resume.delete.mockRejectedValue(new Error('DB'));
      await resumeController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('returns 500 on upload error', async () => {
      req.file = { originalname: 'resume.pdf', filename: 'f.pdf' };
      req.body = { titleEn: 'Resume', titleFr: 'CV' };
      prisma.resume.create.mockRejectedValue(new Error('DB'));
      await resumeController.upload(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('returns 500 on update generic error', async () => {
      req.params.id = 'r1';
      req.body = { titleEn: 'X' };
      prisma.resume.update.mockRejectedValue(new Error('DB'));
      await resumeController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
