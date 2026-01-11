# CollabSpace 🚀

A **production-ready** real-time collaborative workspace platform built with modern web technologies. Features live document editing, presence tracking, cursor synchronization, and seamless team collaboration.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-green?style=for-the-badge&logo=socket.io)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-4.6-red?style=for-the-badge&logo=redis)

## ✨ Features

### 🔥 Real-Time Collaboration

- **Operational Transformation (OT)** - Advanced conflict resolution for concurrent edits
- **Live Cursor Tracking** - See where your teammates are editing in real-time
- **Presence Indicators** - Know who's online and active in each document
- **Instant Synchronization** - Changes appear immediately across all connected clients

### 📝 Document Management

- **Rich Text Editor** - Powered by Quill.js with full formatting support
- **Hierarchical Structure** - Organize documents in folders
- **Version History** - Track changes and revert to previous versions
- **Smart Permissions** - Role-based access control (Owner, Admin, Editor, Viewer)

### 🏢 Workspace Features

- **Multi-Workspace Support** - Create unlimited workspaces for different teams
- **Member Management** - Invite team members with granular permissions
- **Activity Feed** - Track all workspace activities in real-time
- **Notifications** - Get notified about mentions, comments, and updates

### 🛡️ Enterprise-Grade Backend

- **Scalable Architecture** - Built for high concurrency with Redis caching
- **WebSocket Management** - Efficient Socket.io server with connection pooling
- **Database Optimization** - Indexed MongoDB queries for fast performance
- **Session Management** - Secure JWT-based authentication with refresh tokens

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │  ← Frontend (React, TypeScript, Tailwind)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│  API  │ │ Socket  │  ← Backend Layer
│ Routes│ │  Server │
└───┬───┘ └──┬──────┘
    │        │
┌───▼────────▼───┐
│   MongoDB      │  ← Data Layer
│   Redis Cache  │
└────────────────┘
```

### Tech Stack

**Frontend:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Socket.io Client
- Quill.js (Rich Text Editor)
- Zustand (State Management)
- React Query (Data Fetching)

**Backend:**

- Node.js + Socket.io Server
- MongoDB + Mongoose
- Redis (Caching & Sessions)
- NextAuth.js (Authentication)
- JWT (Token Management)

**DevOps:**

- Vercel (Frontend Deployment)
- Railway/Render (WebSocket Server)
- MongoDB Atlas (Database)
- Redis Cloud (Cache)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/collabspace.git
cd collabspace
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

4. **Run the development servers**

Terminal 1 - Next.js App:

```bash
npm run dev
```

Terminal 2 - Socket.io Server:

```bash
npm run server
```

5. **Open your browser**

```
http://localhost:3000
```

## 📁 Project Structure

```
CollabSpace/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── workspace/         # Workspace pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── document/          # Document editor components
│   ├── workspace/         # Workspace components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── db.ts              # MongoDB connection
│   ├── redis.ts           # Redis client
│   └── ot-engine.ts       # Operational Transformation
├── models/                # Mongoose models
│   ├── User.ts
│   ├── Workspace.ts
│   └── Document.ts
├── server/                # Socket.io server
│   └── index.ts           # WebSocket server
└── types/                 # TypeScript types
```

## 🔧 Key Components

### Operational Transformation Engine

The heart of real-time collaboration. Handles concurrent edits with conflict resolution:

```typescript
// lib/ot-engine.ts
- Transform operations against each other
- Apply operations to document state
- Compose sequential operations
- Validate operations before applying
```

### Socket.io Server

Manages all real-time connections and events:

```typescript
// server/index.ts
- Document join/leave events
- Operation broadcasting
- Cursor synchronization
- Presence tracking
- Notification delivery
```

### Redis Integration

High-performance caching and session management:

```typescript
// lib/redis.ts
- Session storage
- User presence tracking
- Document locking
- Cache invalidation
```

## 🎨 Design Philosophy

**Clean & Professional** - Inspired by Figma and modern SaaS applications

- Minimal, uncluttered interface
- Smooth animations and transitions
- Consistent design system
- Responsive on all devices

**Performance First** - Optimized for speed

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Lazy loading and code splitting
- WebSocket connection pooling

**Developer Experience** - Built for maintainability

- TypeScript for type safety
- Modular component architecture
- Comprehensive error handling
- Clear code documentation

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## 📦 Deployment

### Frontend (Vercel)

```bash
vercel deploy
```

### Socket.io Server (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up
```

### Environment Variables

Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your portfolio or production applications.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time powered by [Socket.io](https://socket.io/)
- Rich text editing with [Quill.js](https://quilljs.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for modern teams**

⭐ Star this repo if you find it useful!
