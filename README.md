# ⚡ TaskFlow — Task Management Application

A full-stack task management app with Admin & User panels, real-time charts, messaging, and profile photos.

## 🗂️ Project Structure

```
taskapp/
├── backend/
│   ├── models/         User.js, Task.js, Message.js
│   ├── routes/         auth.js, tasks.js, users.js, messages.js
│   ├── middleware/     auth.js (JWT protect + adminOnly)
│   ├── uploads/        Profile photos saved here
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── css/            style.css (dark/light, responsive)
    ├── js/             api.js (all API calls + utilities)
    ├── pages/
    │   ├── admin-dashboard.html
    │   └── user-dashboard.html
    └── index.html      (Login / Register)
```

## 🚀 Setup & Run

### 1. Prerequisites
- Node.js v16+
- MongoDB (local) OR MongoDB Atlas free tier

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_change_this
ADMIN_EMAIL=paulsubhasini31@gmail.com
ADMIN_PASSWORD=123456
```

For MongoDB Atlas, replace MONGODB_URI with your connection string.

### 4. Start the Server
```bash
cd backend
npm start
# OR for dev with auto-reload:
npm run dev
```

### 5. Open the App
Visit: **http://localhost:5000**

---

## 🔐 Login Credentials

| Role  | Email                      | Password |
|-------|----------------------------|----------|
| Admin | paulsubhasini31@gmail.com  | 123456   |
| User  | Register a new account     | Any      |

---

## ✨ Features

### Admin Panel
- 📊 Dashboard with Pie, Bar, Donut charts
- 📋 Full CRUD on Tasks (create, assign, edit, delete)
- 👥 User Management (add, view, delete users)
- 📈 Per-user task progress & stats
- 💬 Messages inbox with reply functionality
- 👤 Profile with photo upload
- 🔒 Change password
- 🌙 Dark / Light mode toggle

### User Panel
- 🏠 Personal dashboard with stats & charts
- 📋 View assigned tasks (filter by status/priority)
- ✅ Update task status, progress (slider), notes
- 📈 Progress analytics page
- 💬 Contact Admin (send message, view replies)
- 👤 Profile with photo upload
- 🔒 Change password
- 🌙 Dark / Light mode toggle

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT (jsonwebtoken), bcryptjs
- **File Upload:** Multer
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Charts:** Chart.js (CDN)
- **Passwords stored in:** `.env` (hashed with bcrypt in DB)

---

## 📱 Responsive Design
Works on mobile, tablet, and desktop. Hamburger menu on mobile.
