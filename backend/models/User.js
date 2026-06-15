const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  profilePhoto: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  department: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
