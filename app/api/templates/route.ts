import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Template from '@/models/Template';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List templates
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');
      const category = searchParams.get('category');

      await connectDB();

      const query: any = {
        $or: [
          { isPublic: true },
          { createdBy: authRequest.user!.userId },
        ],
      };

      if (workspaceId) {
        query.workspace = workspaceId;
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      const templates = await Template.find(query)
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        templates,
      });
    } catch (error) {
      console.error('List templates error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create template
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { title, description, content, category, isPublic, workspaceId } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        );
      }

      await connectDB();

      const template = await Template.create({
        title,
        description: description || '',
        content,
        category: category || 'other',
        isPublic: isPublic || false,
        workspace: workspaceId || null,
        createdBy: authRequest.user!.userId,
      });

      const populatedTemplate = await Template.findById(template._id)
        .populate('createdBy', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          template: populatedTemplate,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create template error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
