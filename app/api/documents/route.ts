import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List documents
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');
      const search = searchParams.get('search') || '';

      await connectDB();

      const query: any = {};

      if (workspaceId) {
        // Verify user has access to workspace
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

        query.workspace = workspaceId;
      }

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const documents = await Document.find(query)
        .populate('createdBy', 'name email avatar')
        .populate('lastEditedBy', 'name email avatar')
        .sort({ updatedAt: -1 });

      return NextResponse.json({
        success: true,
        documents,
      });
    } catch (error) {
      console.error('List documents error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create document
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { workspaceId, title, content = '' } = body;

      if (!workspaceId || !title) {
        return NextResponse.json(
          { error: 'Workspace ID and title are required' },
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

      // Create document
      const document = await Document.create({
        workspace: workspaceId,
        title,
        content,
        createdBy: authRequest.user!.userId,
        lastEditedBy: authRequest.user!.userId,
        permissions: {
          public: false,
          allowedUsers: [],
        },
      });

      const populatedDocument = await Document.findById(document._id)
        .populate('createdBy', 'name email avatar')
        .populate('lastEditedBy', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          document: populatedDocument,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
