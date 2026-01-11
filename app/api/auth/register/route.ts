import { NextRequest, NextResponse } from 'next/server';
import connectDB, { isDemoMode } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, isValidEmail, isValidPassword, generateToken, generateRefreshToken } from '@/lib/auth';
import { demoStore } from '@/lib/demoStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // DEMO MODE: Use in-memory storage
    if (isDemoMode) {
      console.log('📝 Running in DEMO MODE - using in-memory storage');
      
      if (demoStore.hasUser(email.toLowerCase())) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const demoUser = {
        _id: `demo-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: null,
        role: 'user',
        provider: 'email',
        createdAt: new Date(),
      };
      
      demoStore.addUser(demoUser);

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
          message: 'Demo mode - data stored in memory only',
          user: {
            id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email,
            avatar: demoUser.avatar,
            role: demoUser.role,
          },
          token,
        },
        { status: 201 }
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'email',
    });

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
      { status: 201 }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
