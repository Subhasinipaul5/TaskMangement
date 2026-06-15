const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  tags: [{ type: String }],
  category: { type: String, default: 'General' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
