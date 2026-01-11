"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FileText, 
  Users, 
  Settings,
  Plus,
  Folder,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  workspaceId?: string;
  workspaceName?: string;
}

export function Sidebar({ workspaceId, workspaceName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Workspaces', href: '/workspaces', icon: Folder },
    { name: 'Dashboard', href: '/dashboard', icon: FileText },
  ];

  const workspaceNav = workspaceId ? [
    { name: 'Overview', href: `/workspaces/${workspaceId}`, icon: Home },
    { name: 'Documents', href: `/workspaces/${workspaceId}/documents`, icon: FileText },
    { name: 'Members', href: `/workspaces/${workspaceId}/members`, icon: Users },
    { name: 'Settings', href: `/workspaces/${workspaceId}/settings`, icon: Settings },
  ] : [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">CollabSpace</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Workspace Navigation */}
        {workspaceId && (
          <>
            <div className="pt-4 pb-2">
              {!collapsed && (
                <div className="px-3 mb-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Workspace
                  </p>
                  {workspaceName && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">
                      {workspaceName}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              {workspaceNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </Link>
                );
              })}
            </div>

            {/* Documents Tree */}
            {!collapsed && (
              <div className="pt-4">
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documents
                  </p>
                  <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <File className="w-4 h-4" />
                    <span>No documents yet</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
