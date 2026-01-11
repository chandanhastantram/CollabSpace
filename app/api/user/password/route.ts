import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';
import { comparePassword, hashPassword, isValidPassword } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      // Validate new password
      const passwordValidation = isValidPassword(newPassword);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: 'New password does not meet requirements', details: passwordValidation.errors },
          { status: 400 }
        );
      }

      await connectDB();

      const user = await User.findById(authRequest.user!.userId);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Check if user has a password (not OAuth user)
      if (!user.password) {
        return NextResponse.json(
          { error: 'Cannot change password for OAuth accounts' },
          { status: 400 }
        );
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      // Hash and save new password
      user.password = await hashPassword(newPassword);
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
