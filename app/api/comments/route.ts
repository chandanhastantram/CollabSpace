import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Document from '@/models/Document';
import Notification from '@/models/Notification';
import { requireAuth } from '@/middleware/auth';

// List comments
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const documentId = searchParams.get('documentId');

      if (!documentId) {
        return NextResponse.json(
          { error: 'Document ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      const comments = await Comment.find({ document: documentId, parentComment: null })
        .populate('author', 'name email avatar')
        .populate('mentions', 'name email')
        .populate({
          path: 'parentComment',
          populate: { path: 'author', select: 'name email avatar' },
        })
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        comments,
      });
    } catch (error) {
      console.error('List comments error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create comment
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { documentId, content, mentions, parentCommentId } = body;

      if (!documentId || !content) {
        return NextResponse.json(
          { error: 'Document ID and content are required' },
          { status: 400 }
        );
      }

      await connectDB();

      const document = await Document.findById(documentId);
      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      const comment = await Comment.create({
        document: documentId,
        author: authRequest.user!.userId,
        content,
        mentions: mentions || [],
        parentComment: parentCommentId || null,
      });

      // Create notifications for mentions
      if (mentions && mentions.length > 0) {
        const notificationPromises = mentions.map((userId: string) =>
          Notification.create({
            recipient: userId,
            sender: authRequest.user!.userId,
            type: 'mention',
            title: 'You were mentioned',
            message: `${authRequest.user!.name} mentioned you in a comment`,
            link: `/workspaces/${document.workspace}/documents/${documentId}`,
            relatedDocument: documentId,
          })
        );
        await Promise.all(notificationPromises);
      }

      const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'name email avatar')
        .populate('mentions', 'name email');

      return NextResponse.json(
        {
          success: true,
          comment: populatedComment,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create comment error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
