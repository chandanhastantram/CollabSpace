"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { DynamicAvatar } from '@/components/widgets/DynamicAvatar';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Spinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';
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
  ChevronRight,
  BarChart2
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
      <div className="min-h-screen flex items-center justify-center bg-black">
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
    },
    { 
      icon: Users, 
      label: 'New Workspace', 
      desc: 'Create a team workspace',
      href: '/workspaces/new',
    },
    { 
      icon: Video, 
      label: 'Start Meeting', 
      desc: 'Start a video call',
      href: '/meeting',
    },
  ];

  const features = [
    { 
      icon: FileText, 
      label: 'Documents', 
      desc: 'Create and edit documents',
      href: '/documents',
    },
    { 
      icon: Users, 
      label: 'Workspaces', 
      desc: 'Manage team workspaces',
      href: '/workspaces',
    },
    { 
      icon: Video, 
      label: 'Meetings', 
      desc: 'Video calls & screen share',
      href: '/meeting',
    },
    { 
      icon: FolderOpen, 
      label: 'My Files', 
      desc: 'Browse all your files',
      href: '/files',
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      desc: 'Chat with your team',
      href: '/messages',
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      desc: 'View all notifications',
      href: '/notifications',
    },
    { 
      icon: BarChart2, 
      label: 'Analytics', 
      desc: 'View usage statistics',
      href: '/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20 sticky top-0 z-50">
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
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions with Glowing Effect */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group relative block"
            >
              <div className="relative h-full rounded-xl border border-white/20 p-1">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                  variant="default"
                />
                <div className="relative flex items-center p-4 bg-black rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{action.label}</p>
                    <p className="text-sm text-gray-400">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Features with Glowing Effect */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            All Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.label}
                href={feature.href}
                className="group relative block min-h-[10rem]"
              >
                <div className="relative h-full rounded-xl border border-white/20 p-1">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                    variant="default"
                  />
                  <div className="relative h-full p-4 bg-black rounded-lg hover:bg-white/5 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="font-medium text-white mb-1">{feature.label}</p>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Link */}
        <div className="flex justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage your account settings
          </Link>
        </div>
      </main>
    </div>
  );
}
