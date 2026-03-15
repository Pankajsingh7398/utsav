# UtsavMitra - Complete Setup Guide

Welcome to UtsavMitra! This guide will help you set up and run the application on your local machine using any code editor.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Install Guide](https://pnpm.io/installation)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code, WebStorm, Sublime Text, or any editor you prefer

## 🚀 Quick Start (5 minutes)

### Step 1: Extract the Project

```bash
unzip utsavmitra-enhanced.zip
cd utsavmitra-enhanced
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/utsavmitra

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@utsavmitra.com
```

### Step 4: Start MongoDB

**On Windows:**
```bash
mongod
```

**On macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

### Step 5: Initialize Database

```bash
pnpm db:push
```

### Step 6: Start the Development Server

```bash
pnpm run dev
```

The application will be available at: `http://localhost:3000`

## 📁 Project Structure

```
utsavmitra-enhanced/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── lib/           # Utilities and API client
│   └── index.html
├── server/                # Express backend
│   ├── _core/            # Core utilities
│   ├── routers/          # tRPC routers
│   └── db.ts             # Database queries
├── drizzle/              # Database schema
├── .env.example          # Environment template
├── package.json
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/utsavmitra`

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `.env`:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/utsavmitra
```

### Email Configuration (Optional)

To enable email notifications:

1. Get an [App Password from Gmail](https://support.google.com/accounts/answer/185833)
2. Update `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=noreply@utsavmitra.com
```

## 📚 Available Commands

```bash
# Development
pnpm run dev              # Start dev server with hot reload

# Database
pnpm db:push             # Push schema changes to database
pnpm db:studio           # Open Drizzle Studio (DB browser)

# Testing
pnpm test                # Run tests
pnpm test:watch          # Run tests in watch mode

# Build
pnpm run build           # Build for production
pnpm run start           # Start production server

# Code Quality
pnpm lint                # Run ESLint
pnpm format              # Format code with Prettier
```

## 🎯 Features

### User Authentication
- Email/Password signup and login
- Email verification (coming soon)
- Secure password hashing with bcrypt
- JWT-based session management

### Booking System
- Create event booking requests
- Real-time booking status tracking
- Admin approval/rejection system
- Automated email notifications

### Admin Dashboard
- View all bookings
- Approve/reject bookings
- Send notifications to customers
- View booking analytics

### Responsive Design
- Mobile-friendly interface
- Works on all screen sizes
- Touch-optimized controls

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows: mongod
# macOS: brew services list
# Linux: sudo systemctl status mongod
```

### Dependencies Installation Failed
```bash
# Clear cache and reinstall
pnpm install --force
```

### Database Schema Issues
```bash
# Reset database
pnpm db:push --force
```

### Hot Reload Not Working
```bash
# Restart dev server
pnpm run dev
```

## 📖 API Documentation

### Authentication Endpoints

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+91 XXXXXXXXXX"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/auth/logout**
```json
{}
```

### tRPC Endpoints

All tRPC endpoints are available at `/api/trpc`

**Create Booking**
```typescript
trpc.bookings.create.useMutation({
  clientName: "John Doe",
  clientEmail: "john@example.com",
  clientPhone: "+91 XXXXXXXXXX",
  eventType: "Wedding",
  eventDate: "2024-12-25",
  location: "New Delhi",
  budget: "₹50,000",
  notes: "Optional notes"
})
```

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens are used for session management
- CORS is configured for secure cross-origin requests
- Environment variables are used for sensitive data
- SQL injection protection via Drizzle ORM

## 📝 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- phone
- role (user/admin)
- emailVerified
- emailVerificationToken
- createdAt
- updatedAt

### Bookings Table
- id (Primary Key)
- userId (Foreign Key)
- clientName
- clientEmail
- clientPhone
- eventType
- eventDate
- location
- budget
- notes
- status (pending/approved/rejected)
- createdAt
- updatedAt

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Deploy to Railway
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Deploy to Render
1. Push code to GitHub
2. Create new web service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Check MongoDB connection
4. Verify environment variables

## 📄 License

This project is proprietary and confidential.

## 🎉 You're All Set!

Your UtsavMitra application is now ready to use. Start creating amazing event bookings!

---

**Happy Coding! 🚀**
