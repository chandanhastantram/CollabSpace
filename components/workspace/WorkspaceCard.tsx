import Link from 'next/link';
import { Users, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkspaceCardProps {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  documentCount?: number;
  userRole: string;
  updatedAt: Date;
  className?: string;
}

export function WorkspaceCard({
  id,
  name,
  description,
  memberCount,
  documentCount = 0,
  userRole,
  updatedAt,
  className,
}: WorkspaceCardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case 'admin':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'editor':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Link href={`/workspaces/${id}`}>
      <div
        className={cn(
          "group p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <span
            className={cn(
              "px-2 py-1 text-xs font-semibold rounded-full capitalize",
              getRoleBadgeColor(userRole)
            )}
          >
            {userRole}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{documentCount} {documentCount === 1 ? 'doc' : 'docs'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
