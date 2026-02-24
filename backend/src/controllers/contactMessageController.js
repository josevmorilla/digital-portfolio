const prisma = require('../config/database');

// Get all contact messages (admin only)
exports.getAll = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contact message by ID (admin only)
exports.getById = async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });

    if (!message) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    // Mark as read
    if (!message.read) {
      await prisma.contactMessage.update({
        where: { id: req.params.id },
        data: { read: true },
      });
      message.read = true;
    }

    res.json(message);
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create contact message (public endpoint - no auth required)
exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    res.status(201).json({
      message: 'Message sent successfully. We will get back to you soon!',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark message as read (admin only)
exports.markAsRead = async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Mark as read error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark message as unread (admin only)
exports.markAsUnread = async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: false },
    });

    res.json({ message: 'Message marked as unread', data: message });
  } catch (error) {
    console.error('Mark as unread error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete contact message (admin only)
exports.delete = async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact message error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get unread count (admin only)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.contactMessage.count({
      where: { read: false },
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
