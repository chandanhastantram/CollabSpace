import { NextRequest, NextResponse } from 'next/server';
import connectDB, { isDemoMode } from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken, generateRefreshToken, isValidEmail } from '@/lib/auth';
import { demoStore } from '@/lib/demoStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // DEMO MODE: Use in-memory storage
    if (isDemoMode) {
      console.log('🔐 Running in DEMO MODE - checking in-memory storage');

      const demoUser = demoStore.getUser(email.toLowerCase());
      if (!demoUser) {
        return NextResponse.json(
          { error: 'Invalid credentials. Please register first in demo mode.' },
          { status: 401 }
        );
      }

      const isValidPwd = await comparePassword(password, demoUser.password);
      if (!isValidPwd) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = generateToken({
        userId: demoUser._id,
        email: demoUser.email,
        role: demoUser.role,
      });

      const refreshToken = generateRefreshToken({
        userId: demoUser._id,
        email: demoUser.email,
        role: demoUser.role,
      });

      const response = NextResponse.json(
        {
          success: true,
          message: 'Demo mode - logged in successfully',
          user: {
            id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email,
            avatar: demoUser.avatar,
            role: demoUser.role,
          },
          token,
        },
        { status: 200 }
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    // PRODUCTION MODE: Use MongoDB
    const db = await connectDB();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check MONGODB_URI.' },
        { status: 503 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user registered with OAuth
    if (user.provider !== 'email' && !user.password) {
      return NextResponse.json(
        { error: `Please sign in with ${user.provider}` },
        { status: 400 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    user.updatedAt = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data and tokens
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

