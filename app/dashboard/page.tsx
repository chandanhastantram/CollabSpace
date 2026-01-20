"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { FloatingShapes, Sticker, BrutalistCard, BrutalistButton } from '@/components/ui/RetroElements';
import { DynamicAvatar } from '@/components/widgets/DynamicAvatar';
import { 
  FileText, 
  Users, 
  Video, 
  Plus,
  FolderOpen,
  MessageSquare,
  Bell,
  Search,
  LogOut,
  Zap,
  Settings,
  UserPlus,
  BarChart2
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="retro-loader"></div>
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
      color: 'yellow',
    },
    { 
      icon: Users, 
      label: 'New Workspace', 
      desc: 'Create a team workspace',
      href: '/workspaces/new',
      color: 'white',
    },
    { 
      icon: Video, 
      label: 'Start Meeting', 
      desc: 'Start a video call',
      href: '/meeting',
      color: 'yellow',
    },
  ];

  const features = [
    { icon: FileText, label: 'Documents', desc: 'Create and edit', href: '/documents', emoji: '📄' },
    { icon: Users, label: 'Workspaces', desc: 'Manage teams', href: '/workspaces', emoji: '👥' },
    { icon: Video, label: 'Meetings', desc: 'Video calls', href: '/meeting', emoji: '🎥' },
    { icon: FolderOpen, label: 'My Files', desc: 'Browse files', href: '/files', emoji: '📁' },
    { icon: MessageSquare, label: 'Messages', desc: 'Team chat', href: '/messages', emoji: '💬' },
    { icon: UserPlus, label: 'Connections', desc: 'Find people', href: '/connections', emoji: '🤝' },
    { icon: Bell, label: 'Notifications', desc: 'View alerts', href: '/notifications', emoji: '🔔' },
    { icon: BarChart2, label: 'Analytics', desc: 'View stats', href: '/analytics', emoji: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] grid-pattern relative overflow-hidden">
      <FloatingShapes />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-black dark:border-white bg-[#FFF8E7] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-[#FFE500] border-3 border-black flex items-center justify-center transform group-hover:rotate-6 transition-transform" style={{ borderWidth: '3px' }}>
                <Zap className="w-7 h-7 text-black" />
              </div>
              <span className="text-2xl font-black text-black dark:text-white">CollabSpace</span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="brutalist-input w-full pl-12"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link href="/notifications" className="relative">
                <BrutalistButton variant="ghost" size="sm" className="p-2">
                  <Bell className="w-5 h-5" />
                </BrutalistButton>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] border-2 border-black text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </Link>

              <Link href="/profile" className="flex items-center gap-3 p-2 border-3 border-black bg-white hover:bg-[#FFE500] transition-colors" style={{ borderWidth: '3px' }}>
                <DynamicAvatar seed={user.email} style="avataaars" size={36} />
                <div className="hidden md:block text-left">
                  <p className="font-bold text-black text-sm">{user.name}</p>
                  <p className="text-xs text-black/60">{user.email}</p>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-3 border-3 border-black bg-white hover:bg-[#FF6B35] hover:text-white transition-colors"
                style={{ borderWidth: '3px' }}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className={`mb-10 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 mb-4">
            <Sticker variant="mint">Dashboard</Sticker>
            <Sticker variant="yellow">Welcome Back!</Sticker>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2">
            Hey, <span className="inline-block bg-[#FFE500] px-3 transform -rotate-1">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              className={`group ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${200 + index * 100}ms` } as React.CSSProperties}
            >
              <BrutalistCard 
                variant={action.color as 'white' | 'yellow'} 
                className="p-6 h-full flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-black flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <action.icon className="w-8 h-8 text-[#FFE500]" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-xl text-black">{action.label}</p>
                  <p className="text-black/60">{action.desc}</p>
                </div>
              </BrutalistCard>
            </Link>
          ))}
        </div>

        {/* All Features */}
        <div className={`mb-12 ${mounted ? 'animate-slide-up delay-500' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 mb-6">
            <Sticker variant="orange">All Features</Sticker>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Link
                key={feature.label}
                href={feature.href}
                className={`group ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${600 + index * 50}ms` } as React.CSSProperties}
              >
                <BrutalistCard 
                  variant={index % 2 === 0 ? 'white' : 'yellow'} 
                  tilt={index % 3 === 0}
                  className="p-5 h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                  </div>
                  <p className="font-black text-lg text-black">{feature.label}</p>
                  <p className="text-sm text-black/60">{feature.desc}</p>
                </BrutalistCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Link */}
        <div className={`flex justify-center ${mounted ? 'animate-slide-up delay-700' : 'opacity-0'}`}>
          <Link href="/profile">
            <BrutalistButton variant="ghost" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage your account settings
            </BrutalistButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
