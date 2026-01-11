import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Folder from '@/models/Folder';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List folders
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');
      const parentId = searchParams.get('parentId');

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

      // Get folders
      const query: any = { workspace: workspaceId };
      if (parentId) {
        query.parent = parentId;
      } else {
        query.parent = null;
      }

      const folders = await Folder.find(query)
        .populate('createdBy', 'name email avatar')
        .sort({ name: 1 });

      return NextResponse.json({
        success: true,
        folders,
      });
    } catch (error) {
      console.error('List folders error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create folder
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { workspaceId, name, parentId } = body;

      if (!workspaceId || !name) {
        return NextResponse.json(
          { error: 'Workspace ID and name are required' },
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

      const member = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!member || member.role === 'viewer') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Create folder
      const folder = await Folder.create({
        name,
        workspace: workspaceId,
        parent: parentId || null,
        createdBy: authRequest.user!.userId,
      });

      const populatedFolder = await Folder.findById(folder._id)
        .populate('createdBy', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          folder: populatedFolder,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create folder error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
