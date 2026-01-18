import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Lazy load MongoDB client to avoid build-time errors
const getClientPromise = async () => {
  const { default: clientPromise } = await import('@/lib/mongodb-client');
  return clientPromise;
};

// Create adapter only if MongoDB URI is available
const getAdapter = () => {
  if (!process.env.MONGODB_URI) {
    return undefined;
  }
  // Dynamic import to avoid build-time errors
  const clientPromise = require('@/lib/mongodb-client').default;
  return MongoDBAdapter(clientPromise);
};

export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        if (!process.env.MONGODB_URI) {
          throw new Error('Database not configured');
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if user has a password (OAuth users won't have one)
        if (!user.password) {
          throw new Error('Please sign in with your OAuth provider');
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id || (user as any)._id?.toString();
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        
        // Store provider info
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure user is created in our database
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!process.env.MONGODB_URI) {
          return true; // Skip DB operations if not configured
        }
        
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user for OAuth
            await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
              emailVerified: true,
            });
          }
        } catch (error) {
          console.error('Error creating OAuth user:', error);
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
