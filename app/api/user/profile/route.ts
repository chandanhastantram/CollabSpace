import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const user = await User.findById(authRequest.user!.userId).select('-password');

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          provider: user.provider,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { name, avatar } = body;

      await connectDB();

      const user = await User.findById(authRequest.user!.userId);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update fields
      if (name) user.name = name;
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      await User.findByIdAndDelete(authRequest.user!.userId);

      const response = NextResponse.json({
        success: true,
        message: 'Account deleted successfully',
      });

      // Clear cookies
      response.cookies.delete('token');
      response.cookies.delete('refreshToken');

      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
