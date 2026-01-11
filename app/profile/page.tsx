"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { DynamicAvatar } from '@/components/widgets/DynamicAvatar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import { 
  User, 
  Mail, 
  Save, 
  ArrowLeft,
  Check
} from 'lucide-react';
import Link from 'next/link';

const avatarStyles = [
  { id: 'avataaars', name: 'Character' },
  { id: 'bottts', name: 'Robot' },
  { id: 'lorelei', name: 'Abstract' },
  { id: 'pixel', name: 'Pixel' },
  { id: 'initials', name: 'Initials' },
  { id: 'robot', name: 'Mecha' },
  { id: 'monster', name: 'Monster' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('avataaars');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? (
                <Spinner size="sm" className="mr-2" />
              ) : saved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Your Profile
        </h1>

        {/* Avatar Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Your Avatar
          </h2>
          
          {/* Current Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <DynamicAvatar 
                seed={user.email} 
                style={selectedAvatar as any}
                size={120} 
                className="border-4 border-indigo-500 shadow-lg"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                {avatarStyles.find(s => s.id === selectedAvatar)?.name}
              </div>
            </div>
          </div>
          
          {/* Avatar Options */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {avatarStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedAvatar(style.id)}
                className={`p-2 rounded-xl border-2 transition-all ${
                  selectedAvatar === style.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <DynamicAvatar 
                  seed={user.email} 
                  style={style.id as any}
                  size={48} 
                  className="mx-auto"
                />
                <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
                  {style.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {user.role || 'User'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                {user.id?.slice(0, 12)}...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
