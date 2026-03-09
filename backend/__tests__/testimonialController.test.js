const testimonialController = require('../src/controllers/testimonialController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  testimonial: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Testimonial Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: undefined };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns only approved testimonials for public', async () => {
      prisma.testimonial.findMany.mockResolvedValue([]);
      await testimonialController.getAll(req, res);
      expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
        where: { approved: true }, orderBy: { order: 'asc' },
      });
    });

    test('returns all testimonials for admin', async () => {
      req.user = { id: '1' };
      prisma.testimonial.findMany.mockResolvedValue([]);
      await testimonialController.getAll(req, res);
      expect(prisma.testimonial.findMany).toHaveBeenCalledWith({
        where: {}, orderBy: { order: 'asc' },
      });
    });

    test('returns 500 on error', async () => {
      prisma.testimonial.findMany.mockRejectedValue(new Error('DB'));
      await testimonialController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns testimonial by ID', async () => {
      req.params.id = 't1';
      prisma.testimonial.findUnique.mockResolvedValue({ id: 't1' });
      await testimonialController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 't1' });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.testimonial.findUnique.mockResolvedValue(null);
      await testimonialController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {
    test('creates testimonial with defaults', async () => {
      req.body = { content: 'Great work!' };
      prisma.testimonial.create.mockResolvedValue({ id: 't1', name: 'Anonymous', approved: false });
      await testimonialController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(prisma.testimonial.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Anonymous', position: 'Client', approved: false }),
      });
    });
  });

  describe('update', () => {
    test('updates testimonial', async () => {
      req.params.id = 't1';
      req.body = { name: 'Updated', approved: 'true', order: '1' };
      prisma.testimonial.update.mockResolvedValue({ id: 't1', name: 'Updated' });
      await testimonialController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 't1', name: 'Updated' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      req.body = { name: 'X' };
      prisma.testimonial.update.mockRejectedValue({ code: 'P2025' });
      await testimonialController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('approve', () => {
    test('approves testimonial', async () => {
      req.params.id = 't1';
      prisma.testimonial.update.mockResolvedValue({ id: 't1', approved: true });
      await testimonialController.approve(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Testimonial approved successfully' }));
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.testimonial.update.mockRejectedValue({ code: 'P2025' });
      await testimonialController.approve(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('reject', () => {
    test('rejects and deletes testimonial', async () => {
      req.params.id = 't1';
      prisma.testimonial.delete.mockResolvedValue({});
      await testimonialController.reject(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Testimonial rejected and removed successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.testimonial.delete.mockRejectedValue({ code: 'P2025' });
      await testimonialController.reject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes testimonial', async () => {
      req.params.id = 't1';
      prisma.testimonial.delete.mockResolvedValue({});
      await testimonialController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Testimonial deleted successfully' });
    });
  });
});
