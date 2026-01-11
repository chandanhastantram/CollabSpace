import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List activities
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');
      const limit = parseInt(searchParams.get('limit') || '50');

      if (!workspaceId) {
        return NextResponse.json(
          { error: 'Workspace ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Verify workspace access
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      const isMember = workspace.members.some(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!isMember) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      const activities = await Activity.find({ workspace: workspaceId })
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      return NextResponse.json({
        success: true,
        activities,
      });
    } catch (error) {
      console.error('List activities error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
