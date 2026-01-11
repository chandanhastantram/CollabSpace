import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Document from '@/models/Document';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// Get document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const document = await Document.findById(params.id)
        .populate('workspace')
        .populate('createdBy', 'name email avatar')
        .populate('lastEditedBy', 'name email avatar');

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      // Check workspace access
      const workspace = await Workspace.findById(document.workspace);
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

      return NextResponse.json({
        success: true,
        document,
      });
    } catch (error) {
      console.error('Get document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update document
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { title, content } = body;

      await connectDB();

      const document = await Document.findById(params.id).populate('workspace');

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      // Check permissions
      const workspace = await Workspace.findById(document.workspace);
      const member = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!member || member.role === 'viewer') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Update document
      if (title !== undefined) document.title = title;
      if (content !== undefined) document.content = content;
      document.lastEditedBy = authRequest.user!.userId;

      await document.save();

      const updatedDocument = await Document.findById(document._id)
        .populate('createdBy', 'name email avatar')
        .populate('lastEditedBy', 'name email avatar');

      return NextResponse.json({
        success: true,
        document: updatedDocument,
      });
    } catch (error) {
      console.error('Update document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const document = await Document.findById(params.id).populate('workspace');

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      // Check permissions (owner or admin can delete)
      const workspace = await Workspace.findById(document.workspace);
      const member = workspace.members.find(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!member || !['owner', 'admin'].includes(member.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      await Document.findByIdAndDelete(params.id);

      return NextResponse.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      console.error('Delete document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
