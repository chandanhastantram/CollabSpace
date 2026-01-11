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
      <div className="min-h-screen flex items-center justify-center bg-white">
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
      color: 'bg-black'
    },
    { 
      icon: Users, 
      label: 'New Workspace', 
      desc: 'Create a team workspace',
      href: '/workspaces/new',
      color: 'bg-black'
    },
    { 
      icon: Video, 
      label: 'Start Meeting', 
      desc: 'Start a video call',
      href: '/meeting',
      color: 'bg-black'
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                CollabSpace
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white border-2 border-white rounded-lg text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <DynamicAvatar seed={user.email} style="avataaars" size={36} />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
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
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center p-4 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4 group-hover:bg-white`}>
                <action.icon className="w-6 h-6 text-white group-hover:text-black" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{action.label}</p>
                <p className="text-sm opacity-70">{action.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-50" />
            </Link>
          ))}
        </div>

        {/* All Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">
            All Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.label}
                href={feature.href}
                className="group p-4 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-white">
                    <feature.icon className="w-5 h-5 text-white group-hover:text-black" />
                  </div>
                  {feature.count !== null && feature.count > 0 && (
                    <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded-full group-hover:bg-white group-hover:text-black">
                      {feature.count}
                    </span>
                  )}
                </div>
                <p className="font-medium">{feature.label}</p>
                <p className="text-sm opacity-70">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Link */}
        <div className="flex justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage your account settings
          </Link>
        </div>
      </main>
    </div>
  );
}
