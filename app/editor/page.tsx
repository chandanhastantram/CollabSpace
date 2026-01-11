"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/Button";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert("Document saved!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Document Editor
            </h1>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Untitled Document"
            className="w-full text-4xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your document..."
            className="min-h-[500px]"
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Editor Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✅ Rich text formatting (bold, italic, underline, strike)</li>
            <li>✅ Headers (H1, H2, H3)</li>
            <li>✅ Lists (ordered and bullet)</li>
            <li>✅ Text color and background color</li>
            <li>✅ Text alignment</li>
            <li>✅ Links and images</li>
            <li>✅ Dark mode support</li>
            <li>⏳ Real-time collaboration (coming soon)</li>
            <li>⏳ Cursor tracking (coming soon)</li>
            <li>⏳ Version history (coming soon)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
