import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Document from '@/models/Document';
import { requireAuth } from '@/middleware/auth';

// Generate share link
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { permission = 'view', expiresIn } = body;

      await connectDB();

      const document = await Document.findById(params.id);

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      // Generate share token
      const shareToken = generateShareToken();
      const expiresAt = expiresIn 
        ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
        : null;

      // Update document with share settings
      document.shareSettings = {
        enabled: true,
        token: shareToken,
        permission,
        expiresAt,
      };

      await document.save();

      const shareUrl = `${process.env.NEXTAUTH_URL}/share/${shareToken}`;

      return NextResponse.json({
        success: true,
        shareUrl,
        token: shareToken,
        permission,
        expiresAt,
      });
    } catch (error) {
      console.error('Share document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Revoke share link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      await connectDB();

      const document = await Document.findById(params.id);

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      document.shareSettings = {
        enabled: false,
        token: null,
        permission: 'view',
        expiresAt: null,
      };

      await document.save();

      return NextResponse.json({
        success: true,
        message: 'Share link revoked',
      });
    } catch (error) {
      console.error('Revoke share error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
