"use client";

import { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderNode {
  _id: string;
  name: string;
  children?: FolderNode[];
}

interface FolderTreeProps {
  folders: FolderNode[];
  onFolderClick?: (folderId: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  className?: string;
}

export function FolderTree({
  folders,
  onFolderClick,
  onCreateFolder,
  className,
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder._id);
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder._id} className="select-none">
        <div
          className={cn(
            "flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group",
            className
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder._id);
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          <Folder className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          
          <span
            onClick={() => onFolderClick?.(folder._id)}
            className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate"
          >
            {folder.name}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder?.(folder._id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {folder.children!.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => renderFolder(folder))}
    </div>
  );
}
