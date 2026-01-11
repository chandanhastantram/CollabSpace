import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Document from '@/models/Document';
import { requireAuth } from '@/middleware/auth';
import { exportToPDF, exportToDOCX, exportToMarkdown, exportToHTML } from '@/lib/export-utils';

// Export document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const format = searchParams.get('format') || 'pdf';

      await connectDB();

      const document = await Document.findById(params.id);

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      const title = document.title;
      const content = document.content;

      let blob: Blob | string;
      let contentType: string;
      let filename: string;

      switch (format.toLowerCase()) {
        case 'pdf':
          blob = await exportToPDF(title, content);
          contentType = 'application/pdf';
          filename = `${title}.pdf`;
          break;

        case 'docx':
          blob = await exportToDOCX(title, content);
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          filename = `${title}.docx`;
          break;

        case 'md':
        case 'markdown':
          blob = exportToMarkdown(title, content);
          contentType = 'text/markdown';
          filename = `${title}.md`;
          break;

        case 'html':
          blob = exportToHTML(title, content);
          contentType = 'text/html';
          filename = `${title}.html`;
          break;

        default:
          return NextResponse.json(
            { error: 'Unsupported format' },
            { status: 400 }
          );
      }

      // Return file
      if (typeof blob === 'string') {
        return new NextResponse(blob, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        });
      } else {
        const buffer = await blob.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        });
      }
    } catch (error) {
      console.error('Export document error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
