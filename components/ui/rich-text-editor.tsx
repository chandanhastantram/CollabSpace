"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  theme?: "snow" | "bubble";
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  className,
  theme = "snow",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !editorRef.current) return;

    // Dynamically import Quill only on client side
    import("quill").then((Quill) => {
      if (quillRef.current) return; // Already initialized

      const quill = new Quill.default(editorRef.current!, {
        theme: theme,
        readOnly: readOnly,
        placeholder: placeholder,
        modules: {
          toolbar: readOnly
            ? false
            : [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ["link", "image"],
                ["clean"],
              ],
        },
      });

      // Set initial value
      if (value) {
        try {
          const delta = JSON.parse(value);
          quill.setContents(delta);
        } catch {
          quill.setText(value);
        }
      }

      // Handle changes
      quill.on("text-change", () => {
        const content = JSON.stringify(quill.getContents());
        onChange?.(content);
      });

      quillRef.current = quill;
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [isClient, onChange, placeholder, readOnly, theme, value]);

  // Update content when value prop changes
  useEffect(() => {
    if (!quillRef.current || !value) return;

    try {
      const delta = JSON.parse(value);
      const currentDelta = quillRef.current.getContents();
      
      // Only update if content is different
      if (JSON.stringify(currentDelta) !== value) {
        quillRef.current.setContents(delta);
      }
    } catch {
      // If not valid JSON, treat as plain text
      if (quillRef.current.getText() !== value) {
        quillRef.current.setText(value);
      }
    }
  }, [value]);

  if (!isClient) {
    return (
      <div className={cn("min-h-[300px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rich-text-editor", className)}>
      <div ref={editorRef} />
    </div>
  );
}
