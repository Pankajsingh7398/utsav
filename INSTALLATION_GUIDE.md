# UtsavMitra - Event Decoration Booking System
## Complete Installation & Setup Guide

---

## 📋 Project Overview

**UtsavMitra** is a complete event decoration booking management system with:
- User authentication (email/password)
- Booking form for customers
- Admin dashboard for managing bookings
- Email notifications
- Responsive design for all devices
- MongoDB database integration
- Standalone backend (no external dependencies)

---

## 🛠️ Prerequisites

Before installation, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control)
- **npm** or **pnpm** (package manager)

---

## 📦 Installation Steps

### Step 1: Extract the Project

```bash
# Extract the zip file
unzip utsavmitra-enhanced.zip
cd utsavmitra-enhanced
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
pnpm install

# If using npm instead:
npm install
```

### Step 3: Start MongoDB

**On Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly:
mongod --dbpath "C:\data\db"
```

**On macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or run mongod directly:
mongod
```

**On Linux:**
```bash
# Using systemctl
sudo systemctl start mongod

# Or run mongod directly:
mongod
```

### Step 4: Start the Development Server

```bash
# Start both frontend and backend
pnpm run dev

# The application will be available at:
# http://localhost:3000
```

---

## 🚀 Usage

### For Customers:

1. **Visit the website** at `http://localhost:3000`
2. **Click "Book Now"** to open the booking form
3. **Fill in your details:**
   - Name, Email, Phone
   - Event Type (Wedding, Birthday, Anniversary, etc.)
   - Event Date
   - Location
   - Budget Range
   - Additional Notes
4. **Submit the booking** - Confirmation will be displayed

### For Admins:

1. **Sign In** with admin credentials
2. **Click "Dashboard"** in the header menu
3. **View pending bookings** and take action:
   - ✅ **Approve** - Send approval notification to customer
   - ❌ **Reject** - Send rejection notification with reason
4. **Track booking status** (Pending, Approved, Rejected)

---

## 📁 Project Structure

```
utsavmitra-enhanced/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── App.tsx        # Main app routes
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
├── server/                # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── routers.ts         # tRPC procedures
│   └── index.ts           # Server entry point
├── package.json           # Dependencies
└── INSTALLATION_GUIDE.md  # This file
```

---

## 🔑 Key Features

### Authentication
- Email/Password login
- Session management with JWT
- Protected routes for authenticated users
- Admin role-based access control

### Booking Management
- Submit bookings without login (guest bookings)
- View booking history (My Bookings)
- Real-time status updates
- Booking details display

### Admin Dashboard
- View all pending bookings
- Approve/Reject bookings
- Filter by status
- Notification system

### Contact Information
- **Email:** pankajmall7398@gmail.com (clickable mailto link)
- **Phone:** +91 7398302396 (clickable tel link)
- Responsive contact section in footer

### Responsive Design
- Mobile-first approach
- Burger menu on mobile/tablet
- Desktop navigation with clean links
- Optimized for all screen sizes

---

## 🔧 Configuration

### MongoDB Connection

The application connects to MongoDB at `mongodb://localhost:27017/utsavmitra` by default.

To change the connection string:
1. Open `server/index.ts`
2. Update the MongoDB URI

### Change Server Port

Default port is `3000`. To use a different port, set the PORT environment variable:

```bash
PORT=3001 pnpm run dev
```

---

## 🧪 Testing

### Manual Testing Checklist:

- [ ] Booking form submits successfully
- [ ] Admin can approve/reject bookings
- [ ] Notifications are sent
- [ ] Responsive design works on mobile
- [ ] Burger menu appears on mobile
- [ ] All navigation links work
- [ ] Contact links are clickable
- [ ] Sign In/Logout functionality works

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Ensure MongoDB is running
mongod

# Verify connection at localhost:27017
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Use a different port:
PORT=3001 pnpm run dev

# Or kill the process using port 3000:
# On Windows: netstat -ano | findstr :3000
# On Mac/Linux: lsof -i :3000 | grep LISTEN
```

### Issue: Dependencies Installation Fails
**Solution:**
```bash
# Clear cache and reinstall
pnpm install --force

# Or use npm:
npm install --force
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (md) - Burger menu visible
- **Tablet:** 768px - 1024px - Burger menu visible
- **Desktop:** > 1024px - Navigation links visible

---

## 🔐 Security Notes

1. Change JWT_SECRET in production
2. Use HTTPS in production
3. Validate all inputs on backend
4. Use environment variables for sensitive data
5. Enable CORS only for trusted domains

---

## 📞 Support & Contact

**Admin Contact:**
- Email: pankajmall7398@gmail.com
- Phone: +91 7398302396

---

## ✅ Quick Start Command

```bash
# One-line setup (after extracting the zip):
cd utsavmitra-enhanced && pnpm install && pnpm run dev
```

Then open `http://localhost:3000` in your browser.

---

**Last Updated:** March 8, 2026
**Version:** 1.0.0
