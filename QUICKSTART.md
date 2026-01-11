# 🚀 Quick Start Guide - CollabSpace

Get your real-time collaborative workspace running in **5 minutes**!

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ MongoDB (local or Atlas account)
- ✅ Redis (local or cloud account)

## Step 1: Clone & Install

```bash
# Navigate to the project
cd CollabSpace

# Install dependencies (already done!)
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# MongoDB - Get from https://mongodb.com/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabspace

# Redis - Use local or https://redis.com/cloud
REDIS_URL=redis://localhost:6379

# Generate secrets with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here
JWT_SECRET=your-generated-jwt-secret-here

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
```

### Quick MongoDB Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### Quick Redis Setup (Free)

**Option 1: Local Redis (Recommended for development)**

```bash
# Windows (using Chocolatey)
choco install redis-64

# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

**Option 2: Redis Cloud (Free tier)**

1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create free account
3. Create database
4. Copy the connection string

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

## Step 3: Run the Application

You need **TWO terminals**:

### Terminal 1: Next.js Frontend

```bash
npm run dev
```

This starts the Next.js app on `http://localhost:3000`

### Terminal 2: Socket.io Server

```bash
npm run server
```

This starts the WebSocket server on `http://localhost:3001`

## Step 4: Open Your Browser

Navigate to:

```
http://localhost:3000
```

You should see the beautiful landing page! 🎉

## 🎯 What's Working Now

✅ **Frontend**

- Clean, professional landing page
- Responsive design
- Smooth animations
- Tailwind CSS styling

✅ **Backend Infrastructure**

- MongoDB connection (models ready)
- Redis client (caching & sessions)
- Socket.io server (real-time ready)
- Operational Transformation engine

## 🚧 Next Steps

To complete the full application, you need to implement:

1. **Authentication** (Phase 2)

   - User registration/login
   - JWT token management
   - OAuth providers

2. **Workspace UI** (Phase 3)

   - Dashboard
   - Workspace creation
   - Member management

3. **Document Editor** (Phase 4)
   - Quill.js integration
   - Real-time collaboration
   - Cursor tracking

## 📝 Development Tips

### Hot Reload

Both servers support hot reload:

- Next.js: Automatically reloads on file changes
- Socket.io: Restart with `npm run server` after changes

### Database Inspection

**MongoDB:**

```bash
# Connect to your database
mongosh "your-connection-string"

# List databases
show dbs

# Use your database
use collabspace

# List collections
show collections

# Query users
db.users.find()
```

**Redis:**

```bash
# Connect to Redis
redis-cli

# List all keys
KEYS *

# Get a value
GET key-name

# Monitor real-time commands
MONITOR
```

### Debugging

**Check if servers are running:**

```bash
# Check Next.js (should return HTML)
curl http://localhost:3000

# Check Socket.io (should return socket.io info)
curl http://localhost:3001/socket.io/
```

**Common Issues:**

1. **Port already in use**

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection failed**

   - Check your connection string
   - Ensure IP is whitelisted in MongoDB Atlas
   - Verify username/password

3. **Redis connection failed**
   - Ensure Redis is running: `redis-cli ping` (should return PONG)
   - Check REDIS_URL in .env.local

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(240 5.9% 10%)", // Change this
  },
}
```

### Change Fonts

Edit `app/layout.tsx`:

```typescript
import { YourFont } from "next/font/google";
```

## 📚 Project Structure

```
CollabSpace/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page ✅
│   ├── layout.tsx         # Root layout ✅
│   └── globals.css        # Global styles ✅
├── components/            # React components
│   └── providers/         # Context providers ✅
├── lib/                   # Utilities
│   ├── db.ts             # MongoDB ✅
│   ├── redis.ts          # Redis ✅
│   ├── ot-engine.ts      # OT Engine ✅
│   └── utils.ts          # Helpers ✅
├── models/               # Database models ✅
├── server/               # Socket.io server ✅
└── types/                # TypeScript types ✅
```

## 🤝 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [Implementation Plan](../brain/.../implementation_plan.md)
- Check [Task Progress](../brain/.../task.md)

## 🎉 You're All Set!

Your development environment is ready. Start building amazing collaborative features!

**Happy Coding! 🚀**
