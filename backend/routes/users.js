const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user task stats for admin
router.get('/:id/stats', protect, adminOnly, async (req, res) => {
  try {
    const total = await Task.countDocuments({ assignedTo: req.params.id });
    const completed = await Task.countDocuments({ assignedTo: req.params.id, status: 'completed' });
    const inProgress = await Task.countDocuments({ assignedTo: req.params.id, status: 'in-progress' });
    const todo = await Task.countDocuments({ assignedTo: req.params.id, status: 'todo' });
    const tasks = await Task.find({ assignedTo: req.params.id }).sort({ updatedAt: -1 }).limit(5);
    res.json({ total, completed, inProgress, todo, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, department, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, department, bio }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload profile photo
router.post('/profile/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: photoUrl }, { new: true }).select('-password');
    res.json({ profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin create user
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, department, role: 'user' });
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin update user
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, department, isActive }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin delete user
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
