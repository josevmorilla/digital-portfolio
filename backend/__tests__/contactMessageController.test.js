const contactMessageController = require('../src/controllers/contactMessageController');
const prisma = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  contactMessage: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
}));

describe('Contact Message Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('returns all messages ordered by createdAt desc', async () => {
      prisma.contactMessage.findMany.mockResolvedValue([{ id: '1' }]);
      await contactMessageController.getAll(req, res);
      expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    test('returns 500 on error', async () => {
      prisma.contactMessage.findMany.mockRejectedValue(new Error('DB'));
      await contactMessageController.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    test('returns message and marks as read', async () => {
      req.params.id = 'm1';
      prisma.contactMessage.findUnique.mockResolvedValue({ id: 'm1', read: false });
      prisma.contactMessage.update.mockResolvedValue({ id: 'm1', read: true });
      await contactMessageController.getById(req, res);
      expect(prisma.contactMessage.update).toHaveBeenCalledWith({
        where: { id: 'm1' }, data: { read: true },
      });
      expect(res.json).toHaveBeenCalled();
    });

    test('returns already-read message without updating', async () => {
      req.params.id = 'm1';
      prisma.contactMessage.findUnique.mockResolvedValue({ id: 'm1', read: true });
      await contactMessageController.getById(req, res);
      expect(prisma.contactMessage.update).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ id: 'm1', read: true });
    });

    test('returns 404 when not found', async () => {
      req.params.id = 'none';
      prisma.contactMessage.findUnique.mockResolvedValue(null);
      await contactMessageController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('create', () => {
    test('creates a contact message', async () => {
      req.body = { name: 'John', email: 'john@test.com', subject: 'Hi', message: 'Hello' };
      prisma.contactMessage.create.mockResolvedValue({ id: 'm1' });
      await contactMessageController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message sent successfully. We will get back to you soon!',
        id: 'm1',
      });
    });
  });

  describe('markAsRead', () => {
    test('marks message as read', async () => {
      req.params.id = 'm1';
      prisma.contactMessage.update.mockResolvedValue({ id: 'm1', read: true });
      await contactMessageController.markAsRead(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Message marked as read', data: { id: 'm1', read: true } });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.contactMessage.update.mockRejectedValue({ code: 'P2025' });
      await contactMessageController.markAsRead(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('markAsUnread', () => {
    test('marks message as unread', async () => {
      req.params.id = 'm1';
      prisma.contactMessage.update.mockResolvedValue({ id: 'm1', read: false });
      await contactMessageController.markAsUnread(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Message marked as unread', data: { id: 'm1', read: false } });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.contactMessage.update.mockRejectedValue({ code: 'P2025' });
      await contactMessageController.markAsUnread(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    test('deletes message', async () => {
      req.params.id = 'm1';
      prisma.contactMessage.delete.mockResolvedValue({});
      await contactMessageController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact message deleted successfully' });
    });

    test('returns 404 on P2025', async () => {
      req.params.id = 'none';
      prisma.contactMessage.delete.mockRejectedValue({ code: 'P2025' });
      await contactMessageController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getUnreadCount', () => {
    test('returns unread count', async () => {
      prisma.contactMessage.count.mockResolvedValue(5);
      await contactMessageController.getUnreadCount(req, res);
      expect(res.json).toHaveBeenCalledWith({ count: 5 });
    });

    test('returns 500 on error', async () => {
      prisma.contactMessage.count.mockRejectedValue(new Error('DB'));
      await contactMessageController.getUnreadCount(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
