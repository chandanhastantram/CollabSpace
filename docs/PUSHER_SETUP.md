# Pusher Real-time Messaging Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Pusher Account

1. Go to https://dashboard.pusher.com/accounts/sign_up
2. Sign up (free - no credit card required)
3. Verify your email

### Step 2: Create Channels App

1. Click "Create app" or "Get started"
2. Name your app: `collabspace`
3. Select cluster: `ap2` (Asia Pacific - Mumbai) or nearest to you
4. Select "React" as frontend and "Node.js" as backend
5. Click "Create my app"

### Step 3: Get Credentials

1. Go to "App Keys" tab
2. Copy the following:
   - **app_id**
   - **key**
   - **secret**
   - **cluster**

### Step 4: Add to Environment

Add to `.env.local`:

```bash
# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
NEXT_PUBLIC_PUSHER_KEY=your_key_here
PUSHER_SECRET=your_secret_here
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
```

### Step 5: Test It!

1. Restart your dev server: `npm run dev`
2. Go to http://localhost:3000/messages
3. Open in two browser tabs
4. Send a message - it should appear instantly in both tabs!

---

## 🎥 Features Implemented

### ✅ Real-time Messaging

- Instant message delivery
- No page refresh needed
- Works across multiple tabs/browsers

### ✅ Message Persistence

- All messages saved to MongoDB
- Message history loads on page open
- Pagination support for older messages

### ✅ Typing Indicators

- Shows "User is typing..." in real-time
- Auto-clears after 2 seconds of inactivity
- Multiple users can type simultaneously

### ✅ Presence Tracking

- Shows who's online in sidebar
- Updates when users join/leave
- Connection status indicator

---

## 🆓 Free Tier Limits

- **100 concurrent connections**
- **200,000 messages/day**
- **Unlimited channels**
- **Presence channels included**
- **No credit card required**

This is enough for:

- ~100 users online simultaneously
- ~8,333 messages/hour
- Small to medium teams

---

## 🏗️ Architecture

```
User A types message
    ↓
POST /api/messages
    ↓
Save to MongoDB
    ↓
Trigger Pusher event
    ↓
Pusher broadcasts to all subscribers
    ↓
User B receives message instantly
```

---

## 📁 Files Created

### Backend

- `lib/pusher-server.ts` - Server-side Pusher client
- `lib/pusher-client.ts` - Browser-side Pusher client
- `models/Message.ts` - MongoDB Message schema
- `app/api/pusher/auth/route.ts` - Pusher authentication
- `app/api/messages/route.ts` - Send/get messages API
- `app/api/messages/typing/route.ts` - Typing indicators

### Frontend

- `hooks/useRealtimeChat.ts` - React hook for Pusher
- `app/messages/page.tsx` - Real-time chat UI

---

## 🔧 Configuration

### Channel Types

**Presence Channels** (we use these):

- `presence-workspace-{workspaceId}`
- Tracks who's online
- Requires authentication
- Shows member list

**Private Channels** (alternative):

- `private-{channelId}`
- Requires authentication
- No member tracking

### Message Structure

```typescript
interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  channelId: string;
  createdAt: string;
}
```

---

## 🐛 Troubleshooting

### "Authentication failed"

- Check `PUSHER_SECRET` in `.env.local`
- Make sure user is logged in
- Check `/api/pusher/auth` endpoint

### "Messages not appearing"

- Check Pusher credentials
- Open browser console for errors
- Verify channel name matches

### "Typing indicator not working"

- Check `/api/messages/typing` endpoint
- Verify user is authenticated

### "Can't see online members"

- Refresh the page
- Check Pusher connection status
- Verify presence channel subscription

---

## 📊 Pusher Dashboard

Monitor your app at: https://dashboard.pusher.com

- **Debug Console**: See real-time events
- **Usage**: Track messages and connections
- **Logs**: View errors and warnings

---

## 🚀 Production Notes

### Vercel Deployment

1. Add all Pusher env vars to Vercel
2. No extra server needed
3. Works with serverless functions

### Scaling

- Free tier: 100 connections
- Startup plan: 500 connections ($49/mo)
- Pro plan: 2000 connections ($99/mo)

---

## 📚 Resources

- [Pusher Docs](https://pusher.com/docs/channels)
- [pusher-js npm](https://www.npmjs.com/package/pusher-js)
- [Pusher Dashboard](https://dashboard.pusher.com)
