import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Invitation from '@/models/Invitation';
import { requireAuth, optionalAuth } from '@/middleware/auth';

// Get invitation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return optionalAuth(request, async () => {
    try {
      await connectDB();

      const invitation = await Invitation.findById(params.id)
        .populate('workspace', 'name')
        .populate('invitedBy', 'name email');

      if (!invitation) {
        return NextResponse.json(
          { error: 'Invitation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        invitation,
      });
    } catch (error) {
      console.error('Get invitation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Accept/Decline invitation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { action } = body; // 'accept' or 'decline'

      if (!['accept', 'decline'].includes(action)) {
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
      }

      await connectDB();

      const invitation = await Invitation.findById(params.id);

      if (!invitation) {
        return NextResponse.json(
          { error: 'Invitation not found' },
          { status: 404 }
        );
      }

      if (invitation.status !== 'pending') {
        return NextResponse.json(
          { error: 'Invitation is no longer valid' },
          { status: 400 }
        );
      }

      if (invitation.expiresAt < new Date()) {
        invitation.status = 'expired';
        await invitation.save();
        return NextResponse.json(
          { error: 'Invitation has expired' },
          { status: 400 }
        );
      }

      invitation.status = action === 'accept' ? 'accepted' : 'declined';
      await invitation.save();

      return NextResponse.json({
        success: true,
        invitation,
      });
    } catch (error) {
      console.error('Update invitation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async () => {
    try {
      await connectDB();

      const invitation = await Invitation.findByIdAndDelete(params.id);

      if (!invitation) {
        return NextResponse.json(
          { error: 'Invitation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Invitation deleted successfully',
      });
    } catch (error) {
      console.error('Delete invitation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
