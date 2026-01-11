"use client";

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Template {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
}

interface TemplateGalleryProps {
  templates: Template[];
  onUseTemplate: (templateId: string) => void;
}

export function TemplateGallery({ templates, onUseTemplate }: TemplateGalleryProps) {
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'blank', name: 'Blank' },
    { id: 'meeting-notes', name: 'Meeting Notes' },
    { id: 'project-plan', name: 'Project Plan' },
    { id: 'documentation', name: 'Documentation' },
    { id: 'brainstorm', name: 'Brainstorm' },
    { id: 'other', name: 'Other' },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className="group p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {template.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {template.category}
              </span>
              
              <Button
                onClick={() => onUseTemplate(template._id)}
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
