import Link from 'next/link';
import { FileText, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  id: string;
  title: string;
  workspaceId: string;
  lastEditedBy?: {
    name: string;
    avatar?: string;
  };
  updatedAt: Date;
  className?: string;
}

export function DocumentCard({
  id,
  title,
  workspaceId,
  lastEditedBy,
  updatedAt,
  className,
}: DocumentCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Link href={`/workspaces/${workspaceId}/documents/${id}`}>
      <div
        className={cn(
          "group p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer",
          className
        )}
      >
        {/* Icon and Title */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          {lastEditedBy && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="truncate">{lastEditedBy.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
