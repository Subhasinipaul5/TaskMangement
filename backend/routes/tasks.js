const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// Get all tasks (admin) or own tasks (user)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') query.assignedTo = req.user._id;
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email profilePhoto')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get task stats
router.get('/stats', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') query.assignedTo = req.user._id;
    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: 'completed' });
    const inProgress = await Task.countDocuments({ ...query, status: 'in-progress' });
    const todo = await Task.countDocuments({ ...query, status: 'todo' });
    const high = await Task.countDocuments({ ...query, priority: 'high' });
    const medium = await Task.countDocuments({ ...query, priority: 'medium' });
    const low = await Task.countDocuments({ ...query, priority: 'low' });
    res.json({ total, completed, inProgress, todo, high, medium, low });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single task
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email profilePhoto')
      .populate('assignedBy', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    const populated = await task.populate('assignedTo', 'name email profilePhoto');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Users can only update status and progress of their own tasks
    if (req.user.role !== 'admin') {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const { status, progress, notes } = req.body;
      Object.assign(task, { status, progress, notes });
    } else {
      Object.assign(task, req.body);
    }
    await task.save();
    const populated = await task.populate('assignedTo', 'name email profilePhoto');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
