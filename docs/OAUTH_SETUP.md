# OAuth Authentication Setup Guide

## 🎯 Quick Setup

### Step 1: Generate NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env.local`:

```bash
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API

### 2. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret**

### 3. Add to Environment

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 🐙 GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in details:
   - **Application name**: CollabSpace
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**

### 2. Generate Client Secret

1. Click **Generate a new client secret**
2. Copy **Client ID** and **Client Secret**

### 3. Add to Environment

```bash
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

---

## 💾 MongoDB Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (free tier)

### 2. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database password

### 3. Add to Environment

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabspace?retryWrites=true&w=majority
```

---

## 🧪 Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Email/Password Registration

1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Click "Create account"
4. Should redirect to dashboard

### 3. Test Google OAuth

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with Google account
4. Should redirect to dashboard

### 4. Test GitHub OAuth

1. Go to http://localhost:3000/login
2. Click "Continue with GitHub"
3. Sign in with GitHub account
4. Should redirect to dashboard

---

## 🚀 Production Deployment

### Update OAuth Callback URLs

**Google Console:**

- Add: `https://your-domain.vercel.app/api/auth/callback/google`

**GitHub OAuth App:**

- Update: `https://your-domain.vercel.app/api/auth/callback/github`

### Vercel Environment Variables

Add to Vercel dashboard:

```bash
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_production_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 🔧 Features Implemented

✅ **Email/Password Authentication**

- User registration with bcrypt password hashing
- Login with credentials
- Session management

✅ **Google OAuth**

- One-click Google sign-in
- Auto-create user account
- Profile sync (name, email, avatar)

✅ **GitHub OAuth**

- One-click GitHub sign-in
- Auto-create user account
- Profile sync

✅ **Session Management**

- JWT-based sessions
- 30-day session duration
- Automatic session refresh

✅ **Security**

- Passwords hashed with bcrypt
- Secure session tokens
- CSRF protection (NextAuth built-in)

---

## 🐛 Troubleshooting

### "Configuration error"

- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain

### "OAuth sign in failed"

- Verify OAuth credentials are correct
- Check callback URLs match exactly
- Ensure OAuth apps are enabled

### "Database connection failed"

- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Test connection string

### "User already exists"

- Email is already registered
- Try signing in instead
- Or use "Forgot password" (if implemented)

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
