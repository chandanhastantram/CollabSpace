import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// Search documents
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q') || '';
      const workspaceId = searchParams.get('workspaceId');
      const folderId = searchParams.get('folderId');

      if (!query && !workspaceId) {
        return NextResponse.json(
          { error: 'Search query or workspace ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Build search query
      const searchQuery: any = {};

      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ];
      }

      if (workspaceId) {
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

        searchQuery.workspace = workspaceId;
      }

      if (folderId) {
        searchQuery.folder = folderId;
      }

      const documents = await Document.find(searchQuery)
        .populate('createdBy', 'name email avatar')
        .populate('lastEditedBy', 'name email avatar')
        .populate('folder', 'name')
        .sort({ updatedAt: -1 })
        .limit(50);

      return NextResponse.json({
        success: true,
        documents,
        count: documents.length,
      });
    } catch (error) {
      console.error('Search documents error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
