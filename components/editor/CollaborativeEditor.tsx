"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/loading';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-black border border-white/20 rounded-lg">
      <Spinner size="lg" />
    </div>
  ),
});

import 'react-quill/dist/quill.snow.css';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export function CollaborativeEditor({
  documentId,
  initialContent = '',
  onSave,
  readOnly = false,
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  // const quillRef = useRef<any>(null); // removed ref as not needed

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (value: string) => {
    setContent(value);
    onSave?.(value);
  };

  const modules = {
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
  ];

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-black border border-white/20 rounded-lg">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="collaborative-editor bg-black rounded-lg border border-white/20 overflow-hidden">
      <style jsx global>{`
        .collaborative-editor .ql-toolbar {
          background: #111;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .collaborative-editor .ql-container {
          background: #000;
          border: none;
          min-height: 400px;
        }
        .collaborative-editor .ql-editor {
          color: #fff;
          font-size: 16px;
          line-height: 1.6;
        }
        .collaborative-editor .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4);
        }
        .collaborative-editor .ql-toolbar button {
          color: rgba(255, 255, 255, 0.7);
        }
        .collaborative-editor .ql-toolbar button:hover {
          color: #fff;
        }
        .collaborative-editor .ql-toolbar button.ql-active {
          color: #fff;
        }
        .collaborative-editor .ql-toolbar .ql-stroke {
          stroke: rgba(255, 255, 255, 0.7);
        }
        .collaborative-editor .ql-toolbar .ql-fill {
          fill: rgba(255, 255, 255, 0.7);
        }
        .collaborative-editor .ql-toolbar button:hover .ql-stroke,
        .collaborative-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #fff;
        }
        .collaborative-editor .ql-toolbar button:hover .ql-fill,
        .collaborative-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #fff;
        }
        .collaborative-editor .ql-picker {
          color: rgba(255, 255, 255, 0.7);
        }
        .collaborative-editor .ql-picker-options {
          background: #111;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .collaborative-editor .ql-picker-item {
          color: rgba(255, 255, 255, 0.7);
        }
        .collaborative-editor .ql-picker-item:hover {
          color: #fff;
        }
      `}</style>
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        theme="snow"
        placeholder="Start writing..."
      />
    </div>
  );
}

export default CollaborativeEditor;
