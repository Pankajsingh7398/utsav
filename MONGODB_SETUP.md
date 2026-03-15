# MongoDB Setup Guide for UtsavMitra

This guide will help you set up MongoDB for the UtsavMitra application.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows and download the MSI installer

2. **Run the Installer**
   - Double-click the MSI file
   - Follow the installation wizard
   - Choose "Install MongoDB as a Service" (recommended)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB**
   ```bash
   # MongoDB will start automatically if installed as a service
   # Or manually start:
   mongod
   ```

### macOS

1. **Install with Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify Installation**
   ```bash
   mongod --version
   ```

### Linux (Ubuntu/Debian)

1. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

3. **Enable Auto-start**
   ```bash
   sudo systemctl enable mongod
   ```

4. **Verify Installation**
   ```bash
   mongod --version
   ```

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

### Setup Steps

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email or Google account

2. **Create a Cluster**
   - Click "Create a Deployment"
   - Choose "Free" tier
   - Select your preferred cloud provider and region
   - Click "Create Deployment"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Add Current IP Address"
   - Or add "0.0.0.0/0" to allow all IPs (not recommended for production)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `utsavmitra`

6. **Update .env**
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/utsavmitra
   ```

## Connection String Format

### Local MongoDB
```
mongodb://localhost:27017/utsavmitra
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/utsavmitra
```

### MongoDB with Authentication
```
mongodb://username:password@localhost:27017/utsavmitra
```

## Verify MongoDB Connection

### Using MongoDB Shell

1. **Connect to Local MongoDB**
   ```bash
   mongosh
   ```

2. **Check Databases**
   ```bash
   show databases
   ```

3. **Create/Use Database**
   ```bash
   use utsavmitra
   ```

4. **Check Collections**
   ```bash
   show collections
   ```

### Using Drizzle Studio

```bash
pnpm db:studio
```

This opens a visual database browser at http://localhost:5555

## Database Initialization

After setting up MongoDB, initialize the database schema:

```bash
# Push schema to database
pnpm db:push

# Or reset database (WARNING: deletes all data)
pnpm db:push --force
```

## Troubleshooting

### MongoDB Service Not Running

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB
```

**macOS:**
```bash
# Check status
brew services list

# Start service
brew services start mongodb-community

# Stop service
brew services stop mongodb-community
```

**Linux:**
```bash
# Check status
sudo systemctl status mongod

# Start service
sudo systemctl start mongod

# Stop service
sudo systemctl stop mongod
```

### Connection Refused Error

1. Verify MongoDB is running
2. Check connection string in .env
3. Verify port 27017 is not blocked by firewall
4. For Atlas: Check IP whitelist

### Authentication Failed

1. Verify username and password in connection string
2. Check database user exists in MongoDB Atlas
3. Ensure special characters in password are URL-encoded
4. For local MongoDB: Create user if using authentication

### Database Not Found

1. MongoDB creates databases automatically on first write
2. Run `pnpm db:push` to create schema
3. Check connection string includes database name

## Database Backup

### Local MongoDB

```bash
# Backup database
mongodump --db utsavmitra --out ./backup

# Restore database
mongorestore --db utsavmitra ./backup/utsavmitra
```

### MongoDB Atlas

1. Go to your cluster
2. Click "Backup"
3. Click "Create Backup"
4. Download backup when ready

## Performance Tips

1. **Add Indexes**
   ```javascript
   db.bookings.createIndex({ clientEmail: 1 })
   db.bookings.createIndex({ status: 1 })
   db.bookings.createIndex({ createdAt: -1 })
   ```

2. **Monitor Performance**
   - Use MongoDB Atlas Dashboard
   - Check query performance
   - Monitor connection count

3. **Optimize Queries**
   - Use indexes for frequently queried fields
   - Limit result sets
   - Use projection to select only needed fields

## Security Best Practices

1. **Change Default Credentials**
   - Always use strong passwords
   - Store in .env file

2. **Enable Authentication**
   - Create database users
   - Use role-based access control

3. **Backup Regularly**
   - Automated backups with Atlas
   - Manual backups for important data

4. **Monitor Access**
   - Check connection logs
   - Monitor unusual activity
   - Use VPN for remote connections

## Next Steps

1. Update `.env` with your MongoDB connection string
2. Run `pnpm db:push` to initialize schema
3. Start the application with `pnpm run dev`
4. Verify database connection in Drizzle Studio

---

**MongoDB is now ready for UtsavMitra!** 🎉
