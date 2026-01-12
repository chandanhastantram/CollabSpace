import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workspace from '@/models/Workspace';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

// Get workspace
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const workspace = await Workspace.findById(params.id)
        .populate('ownerId', 'name email avatar')
        .populate('members.userId', 'name email avatar');

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Check if user is a member
      const isMember = workspace.members.some(
        (m: any) => m.userId?._id?.toString() === authRequest.user!.userId ||
                    m.userId?.toString() === authRequest.user!.userId
      );

      if (!isMember) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        workspace,
      });
    } catch (error) {
      console.error('Get workspace error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update workspace
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { name, description } = body;

      await connectDB();

      const workspace = await Workspace.findById(params.id);

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Check if user is owner or admin
      const userMember = workspace.members.find(
        (m: any) => m.userId?.toString() === authRequest.user!.userId
      );

      if (!userMember || !['owner', 'admin'].includes(userMember.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Update fields
      if (name) workspace.name = name;
      if (description !== undefined) workspace.description = description;

      await workspace.save();

      const updatedWorkspace = await Workspace.findById(workspace._id)
        .populate('ownerId', 'name email avatar')
        .populate('members.userId', 'name email avatar');

      return NextResponse.json({
        success: true,
        workspace: updatedWorkspace,
      });
    } catch (error) {
      console.error('Update workspace error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete workspace
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const workspace = await Workspace.findById(params.id);

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      // Only owner can delete
      if (workspace.ownerId?.toString() !== authRequest.user!.userId) {
        return NextResponse.json(
          { error: 'Only workspace owner can delete' },
          { status: 403 }
        );
      }

      // Remove workspace from all members
      await User.updateMany(
        { workspaces: workspace._id },
        { $pull: { workspaces: workspace._id } }
      );

      await Workspace.findByIdAndDelete(params.id);

      return NextResponse.json({
        success: true,
        message: 'Workspace deleted successfully',
      });
    } catch (error) {
      console.error('Delete workspace error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
