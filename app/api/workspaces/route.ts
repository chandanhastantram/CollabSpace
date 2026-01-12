import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workspace from '@/models/Workspace';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

// List workspaces
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search') || '';
      const role = searchParams.get('role');

      await connectDB();

      // Find workspaces where user is a member
      const query: any = {
        'members.userId': authRequest.user!.userId,
      };

      if (role) {
        query['members.role'] = role;
      }

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const workspaces = await Workspace.find(query)
        .populate('members.userId', 'name email avatar')
        .populate('ownerId', 'name email avatar')
        .sort({ updatedAt: -1 });

      // Add member count and user's role to each workspace
      const workspacesWithStats = workspaces.map((workspace) => {
        const userMember = workspace.members.find(
          (m: any) => m.userId?._id?.toString() === authRequest.user!.userId ||
                      m.userId?.toString() === authRequest.user!.userId
        );

        return {
          id: workspace._id,
          name: workspace.name,
          description: workspace.description,
          owner: workspace.ownerId,
          memberCount: workspace.members.length,
          userRole: userMember?.role || 'viewer',
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
        };
      });

      return NextResponse.json({
        success: true,
        workspaces: workspacesWithStats,
      });
    } catch (error) {
      console.error('List workspaces error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create workspace
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { name, description } = body;

      if (!name) {
        return NextResponse.json(
          { error: 'Workspace name is required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Create workspace
      const workspace = await Workspace.create({
        name,
        description: description || '',
        ownerId: authRequest.user!.userId,
        members: [
          {
            userId: authRequest.user!.userId,
            role: 'owner',
            joinedAt: new Date(),
          },
        ],
      });

      // Add workspace to user's workspaces
      await User.findByIdAndUpdate(authRequest.user!.userId, {
        $push: { workspaces: workspace._id },
      });

      const populatedWorkspace = await Workspace.findById(workspace._id)
        .populate('ownerId', 'name email avatar')
        .populate('members.userId', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          workspace: populatedWorkspace,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create workspace error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
