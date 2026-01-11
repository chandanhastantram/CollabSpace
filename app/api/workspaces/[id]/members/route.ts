import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Workspace from '@/models/Workspace';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

// List members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const workspace = await Workspace.findById(params.id)
        .populate('members.user', 'name email avatar');

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Check if user is a member
      const isMember = workspace.members.some(
        (m: any) => m.user._id.toString() === authRequest.user!.userId
      );

      if (!isMember) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        members: workspace.members,
      });
    } catch (error) {
      console.error('List members error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Add member
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { userId, role = 'editor' } = body;

      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      const workspace = await Workspace.findById(params.id);

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Check if requester can invite
      const requesterMember = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!requesterMember || !['owner', 'admin'].includes(requesterMember.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Check if user already a member
      const existingMember = workspace.members.find(
        (m: any) => m.user.toString() === userId
      );

      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member' },
          { status: 409 }
        );
      }

      // Add member
      workspace.members.push({
        user: userId,
        role,
        joinedAt: new Date(),
      });

      await workspace.save();

      // Add workspace to user's workspaces
      await User.findByIdAndUpdate(userId, {
        $push: { workspaces: workspace._id },
      });

      const updatedWorkspace = await Workspace.findById(workspace._id)
        .populate('members.user', 'name email avatar');

      return NextResponse.json({
        success: true,
        workspace: updatedWorkspace,
      });
    } catch (error) {
      console.error('Add member error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { userId, role } = body;

      if (!userId || !role) {
        return NextResponse.json(
          { error: 'User ID and role are required' },
          { status: 400 }
        );
      }

      await connectDB();

      const workspace = await Workspace.findById(params.id);

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Only owner and admin can change roles
      const requesterMember = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!requesterMember || !['owner', 'admin'].includes(requesterMember.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Cannot change owner role
      if (workspace.owner.toString() === userId && role !== 'owner') {
        return NextResponse.json(
          { error: 'Cannot change owner role' },
          { status: 400 }
        );
      }

      // Update member role
      const memberIndex = workspace.members.findIndex(
        (m: any) => m.user.toString() === userId
      );

      if (memberIndex === -1) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      workspace.members[memberIndex].role = role;
      await workspace.save();

      const updatedWorkspace = await Workspace.findById(workspace._id)
        .populate('members.user', 'name email avatar');

      return NextResponse.json({
        success: true,
        workspace: updatedWorkspace,
      });
    } catch (error) {
      console.error('Update member error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      const workspace = await Workspace.findById(params.id);

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Cannot remove owner
      if (workspace.owner.toString() === userId) {
        return NextResponse.json(
          { error: 'Cannot remove workspace owner' },
          { status: 400 }
        );
      }

      // Only owner and admin can remove members
      const requesterMember = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!requesterMember || !['owner', 'admin'].includes(requesterMember.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Remove member
      workspace.members = workspace.members.filter(
        (m: any) => m.user.toString() !== userId
      );

      await workspace.save();

      // Remove workspace from user's workspaces
      await User.findByIdAndUpdate(userId, {
        $pull: { workspaces: workspace._id },
      });

      return NextResponse.json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Remove member error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
