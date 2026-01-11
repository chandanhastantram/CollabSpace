import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Invitation from '@/models/Invitation';
import { requireAuth } from '@/middleware/auth';
import { generateRandomToken } from '@/lib/auth';

// Create invitation
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { workspaceId, email, role = 'editor' } = body;

      if (!workspaceId || !email) {
        return NextResponse.json(
          { error: 'Workspace ID and email are required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Check if invitation already exists
      const existingInvitation = await Invitation.findOne({
        workspace: workspaceId,
        email: email.toLowerCase(),
        status: 'pending',
      });

      if (existingInvitation) {
        return NextResponse.json(
          { error: 'Invitation already sent to this email' },
          { status: 409 }
        );
      }

      // Create invitation
      const token = generateRandomToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const invitation = await Invitation.create({
        workspace: workspaceId,
        email: email.toLowerCase(),
        role,
        invitedBy: authRequest.user!.userId,
        token,
        expiresAt,
      });

      return NextResponse.json({
        success: true,
        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      }, { status: 201 });
    } catch (error) {
      console.error('Create invitation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// List invitations
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');

      await connectDB();

      const query: any = {};
      if (workspaceId) {
        query.workspace = workspaceId;
      }

      const invitations = await Invitation.find(query)
        .populate('invitedBy', 'name email')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        invitations,
      });
    } catch (error) {
      console.error('List invitations error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
