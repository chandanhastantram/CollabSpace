"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { DynamicAvatar } from '@/components/widgets/DynamicAvatar';
import { Spinner } from '@/components/ui/loading';
import { 
  FileText, 
  Users, 
  Video, 
  Settings, 
  Plus,
  FolderOpen,
  MessageSquare,
  Bell,
  Search,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    { 
      icon: Plus, 
      label: 'New Document', 
      desc: 'Create a new document',
      href: '/documents/new',
      color: 'bg-indigo-500'
    },
    { 
      icon: Users, 
      label: 'New Workspace', 
      desc: 'Create a team workspace',
      href: '/workspaces/new',
      color: 'bg-purple-500'
    },
    { 
      icon: Video, 
      label: 'Start Meeting', 
      desc: 'Start a video call',
      href: '/meeting',
      color: 'bg-green-500'
    },
  ];

  const features = [
    { 
      icon: FileText, 
      label: 'Documents', 
      desc: 'Create and edit documents',
      href: '/documents',
      count: 0
    },
    { 
      icon: Users, 
      label: 'Workspaces', 
      desc: 'Manage team workspaces',
      href: '/workspaces',
      count: 0
    },
    { 
      icon: Video, 
      label: 'Meetings', 
      desc: 'Video calls & screen share',
      href: '/meeting',
      count: null
    },
    { 
      icon: FolderOpen, 
      label: 'My Files', 
      desc: 'Browse all your files',
      href: '/files',
      count: null
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      desc: 'Chat with your team',
      href: '/messages',
      count: 0
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      desc: 'View all notifications',
      href: '/notifications',
      count: 3
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CollabSpace
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, workspaces..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <DynamicAvatar seed={user.email} style="avataaars" size={36} />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mr-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{action.label}</p>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* All Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            All Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.label}
                href={feature.href}
                className="group p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <feature.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                  {feature.count !== null && feature.count > 0 && (
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                      {feature.count}
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Link */}
        <div className="flex justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage your account settings
          </Link>
        </div>
      </main>
    </div>
  );
}
