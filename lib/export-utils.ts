// Export utilities for documents

/**
 * Export document to PDF
 */
export async function exportToPDF(title: string, content: any): Promise<Blob> {
  // For now, return HTML as a simple export
  // In production, use a library like jsPDF or pdfmake
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${typeof content === 'string' ? content : JSON.stringify(content)}
    </body>
    </html>
  `;
  
  return new Blob([html], { type: 'text/html' });
}

/**
 * Export document to DOCX
 */
export async function exportToDOCX(title: string, content: any): Promise<Blob> {
  // Simple text export for now
  // In production, use a library like docx
  const text = `${title}\n\n${typeof content === 'string' ? content : JSON.stringify(content)}`;
  return new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

/**
 * Export document to Markdown
 */
export function exportToMarkdown(title: string, content: any): string {
  let markdown = `# ${title}\n\n`;
  
  if (typeof content === 'string') {
    markdown += content;
  } else if (content?.ops) {
    // Convert Quill Delta to markdown
    content.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        markdown += op.insert;
      }
    });
  } else {
    markdown += JSON.stringify(content, null, 2);
  }
  
  return markdown;
}

/**
 * Export document to HTML
 */
export function exportToHTML(title: string, content: any): string {
  let body = '';
  
  if (typeof content === 'string') {
    body = content;
  } else if (content?.ops) {
    // Convert Quill Delta to HTML
    content.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        const text = op.insert.replace(/\n/g, '<br>');
        if (op.attributes?.bold) {
          body += `<strong>${text}</strong>`;
        } else if (op.attributes?.italic) {
          body += `<em>${text}</em>`;
        } else {
          body += text;
        }
      }
    });
  } else {
    body = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
  }
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="content">${body}</div>
    </body>
    </html>
  `;
}
