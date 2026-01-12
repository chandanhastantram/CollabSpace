import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        await connectDB();

        // Check if user exists
        let dbUser = await User.findOne({ email: user.email.toLowerCase() });

        if (!dbUser) {
          // Create new user
          dbUser = await User.create({
            name: user.name || user.email.split('@')[0],
            email: user.email.toLowerCase(),
            avatar: user.image || '',
            provider: account?.provider === 'google' ? 'google' : 'github',
            role: 'user',
          });
        } else {
          // Update avatar if changed
          if (user.image && dbUser.avatar !== user.image) {
            dbUser.avatar = user.image;
            await dbUser.save();
          }
        }

        return true;
      } catch (error) {
        console.error('OAuth sign in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
