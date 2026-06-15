const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, adminOnly } = require('../middleware/auth');

// Send message (user)
router.post('/', protect, async (req, res) => {
  try {
    const { subject, body } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      subject, body
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all messages (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'name email profilePhoto').sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unread count (admin)
router.get('/unread-count', protect, adminOnly, async (req, res) => {
  try {
    const count = await Message.countDocuments({ isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as read + reply (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true, reply }, { new: true });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's own sent messages
router.get('/my', protect, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
