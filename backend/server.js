require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin-dashboard.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB error:', err));

// Seed Admin
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hash,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin seeded:', process.env.ADMIN_EMAIL);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
