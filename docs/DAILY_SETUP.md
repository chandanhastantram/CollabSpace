# Daily.co Video Meetings Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Daily.co Account

1. Go to https://dashboard.daily.co/signup
2. Sign up (free - no credit card required)
3. Verify your email

### Step 2: Get API Key

1. Go to https://dashboard.daily.co/developers
2. Copy your API key (starts with a long string)
3. Add to `.env.local`:
   ```bash
   DAILY_API_KEY=your_actual_api_key_here
   ```

### Step 3: Test It!

1. Restart your dev server: `npm run dev`
2. Go to http://localhost:3000/meeting
3. Click "Start Call"
4. Open another browser tab with the meeting link
5. You should see yourself in both tabs!

## 🎥 Features Implemented

✅ **Create/Join Meetings**

- Automatic room creation
- Share meeting links
- Join via URL

✅ **Video Controls**

- Mute/unmute microphone
- Turn camera on/off
- Screen sharing
- Leave meeting

✅ **Multi-user Support**

- Up to 10 participants (configurable)
- Real-time video/audio
- Participant list

## 🆓 Free Tier Limits

- **10,000 minutes/month** (~166 hours)
- **Unlimited rooms**
- **Up to 200 participants per room** (we set max to 10)
- **Screen sharing included**
- **Recording available** (paid feature)

## 📝 How It Works

```
User clicks "Start Call"
    ↓
Frontend calls /api/meetings (create room)
    ↓
Daily.co creates room and returns URL
    ↓
Frontend gets meeting token from /api/meetings/token
    ↓
Daily.co iframe loads with video call
    ↓
Other users join with same room URL
    ↓
WebRTC peer-to-peer connection established
```

## 🔧 Configuration

Edit `app/api/meetings/route.ts` to change settings:

```typescript
properties: {
  enable_screenshare: true,    // Allow screen sharing
  enable_chat: true,           // Enable in-call chat
  max_participants: 10,        // Max users per call
  start_video_off: false,      // Start with video on
  start_audio_off: false,      // Start with audio on
}
```

## 🚀 Next Steps

- [ ] Add meeting history to MongoDB
- [ ] Implement meeting recordings
- [ ] Add in-call chat
- [ ] Create meeting scheduler
- [ ] Add waiting room feature

## 🐛 Troubleshooting

**"Failed to create room"**

- Check your `DAILY_API_KEY` in `.env.local`
- Make sure you restarted the dev server

**"No video/audio"**

- Allow browser permissions for camera/microphone
- Check if another app is using your camera

**"Can't join meeting"**

- Make sure the room exists (create it first)
- Check browser console for errors

## 📚 Resources

- Daily.co Docs: https://docs.daily.co/
- API Reference: https://docs.daily.co/reference/rest-api
- React SDK: https://docs.daily.co/reference/daily-react
