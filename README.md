# CollabSpace 🚀

A real-time collaborative workspace platform built with Next.js, featuring document collaboration, video conferencing, and team management.

![CollabSpace](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-4.8-green)

## ✨ Features

### 📝 Document Collaboration

- Real-time collaborative editing
- Rich text editor with formatting
- Version history
- Document export (PDF, DOCX)

### 📹 Video Conferencing

- Multi-user video calls with WebRTC
- Screen sharing
- In-call chat
- Audio/video controls

### 👥 Team Management

- Workspaces with member management
- Role-based access control
- Invite system
- Activity tracking

### 🎨 User Experience

- Clean, simplified dashboard
- Dynamic avatar generation (7 styles)
- Dark/light theme
- Responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/chandanhastantram/CollabSpace.git
cd CollabSpace

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### Multi-User Video Calls

```bash
# Terminal 1: Start Socket.io server
npm run socket

# Terminal 2: Start Next.js app
npm run dev
```

Then open http://localhost:3000/meeting in two browser tabs!

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3000
```

## 📁 Project Structure

```
CollabSpace/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── meeting/           # Video call page
│   └── profile/           # User profile
├── components/             # React components
│   ├── ui/                # UI components
│   ├── video/             # Video call components
│   └── widgets/           # Dashboard widgets
├── lib/                    # Utilities and helpers
├── hooks/                  # Custom React hooks
├── models/                 # MongoDB models
├── server/                 # Socket.io server
└── types/                  # TypeScript types
```

## 🔧 Environment Variables

| Variable                 | Description               | Required        |
| ------------------------ | ------------------------- | --------------- |
| `MONGODB_URI`            | MongoDB connection string | Yes             |
| `JWT_SECRET`             | JWT signing secret        | Yes             |
| `NEXTAUTH_SECRET`        | NextAuth secret           | Yes             |
| `REDIS_URL`              | Redis connection URL      | No              |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL      | For video calls |

## 📜 Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Build for production     |
| `npm run start`  | Start production server  |
| `npm run socket` | Start Socket.io server   |
| `npm run test`   | Run tests                |
| `npm run lint`   | Run ESLint               |

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Redis
- **Real-time:** Socket.io, WebRTC
- **Auth:** JWT, bcrypt
- **UI:** Lucide Icons, Framer Motion

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Docker

```bash
docker-compose up -d
```

### Manual

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Chandan](https://github.com/chandanhastantram)
