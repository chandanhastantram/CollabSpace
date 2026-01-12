"use client";

import { useState } from 'react';
import { useNotifications, requestNotificationPermission } from '@/hooks/useNotifications';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { formatRelativeTime, getNotificationIcon, NotificationPreferences } from '@/lib/notifications';
import { Button } from '@/components/ui/Button';
import {
  Bell,
  Check,
  X,
  Trash2,
  Settings,
  ArrowLeft,
  CheckCheck,
  Filter,
  RefreshCw,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  FileText,
  Video,
  Cog,
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    refresh,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      updatePreferences({ push: true });
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const PreferenceToggle = ({ 
    label, 
    enabled, 
    icon: Icon,
    onChange 
  }: { 
    label: string; 
    enabled: boolean; 
    icon: React.ElementType;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-medium">{label}</span>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-white' : 'bg-white/20'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full transition-transform ${
            enabled ? 'translate-x-6 bg-black' : 'translate-x-1 bg-gray-400'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center space-x-2">
                <Bell className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-white text-black text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'unread', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'settings' && <Settings className="w-4 h-4 inline mr-2" />}
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-black text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' ? (
          <div className="space-y-6">
            {/* Delivery Methods */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative bg-black rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Delivery Methods</h2>
                  <div className="space-y-3">
                    <PreferenceToggle
                      label="In-App Notifications"
                      enabled={preferences.inApp}
                      icon={Bell}
                      onChange={() => updatePreferences({ inApp: !preferences.inApp })}
                    />
                    <PreferenceToggle
                      label="Push Notifications"
                      enabled={preferences.push}
                      icon={Smartphone}
                      onChange={handleEnablePush}
                    />
                    <PreferenceToggle
                      label="Email Notifications"
                      enabled={preferences.email}
                      icon={Mail}
                      onChange={() => updatePreferences({ email: !preferences.email })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative bg-black rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Notification Types</h2>
                  <div className="space-y-3">
                    <PreferenceToggle
                      label="Mentions"
                      enabled={preferences.mentions}
                      icon={MessageSquare}
                      onChange={() => updatePreferences({ mentions: !preferences.mentions })}
                    />
                    <PreferenceToggle
                      label="Workspace Invites"
                      enabled={preferences.invites}
                      icon={Users}
                      onChange={() => updatePreferences({ invites: !preferences.invites })}
                    />
                    <PreferenceToggle
                      label="Document Updates"
                      enabled={preferences.documentUpdates}
                      icon={FileText}
                      onChange={() => updatePreferences({ documentUpdates: !preferences.documentUpdates })}
                    />
                    <PreferenceToggle
                      label="Meeting Reminders"
                      enabled={preferences.meetings}
                      icon={Video}
                      onChange={() => updatePreferences({ meetings: !preferences.meetings })}
                    />
                    <PreferenceToggle
                      label="System Updates"
                      enabled={preferences.systemUpdates}
                      icon={Cog}
                      onChange={() => updatePreferences({ systemUpdates: !preferences.systemUpdates })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear All */}
            <Button
              onClick={clearAll}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Notifications
            </Button>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div key={notification.id} className="relative group">
                  <div className="relative rounded-xl border border-white/20 p-1">
                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    <div className={`relative bg-black rounded-lg p-4 ${!notification.read ? 'border-l-2 border-l-blue-500' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">{notification.title}</h3>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(new Date(notification.createdAt))}
                            </span>
                          </div>
                          <p className="text-gray-400 mt-1">{notification.message}</p>
                          {notification.sender && (
                            <p className="text-xs text-gray-500 mt-2">
                              From: {notification.sender.name}
                            </p>
                          )}
                          {notification.link && (
                            <Link
                              href={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="inline-flex items-center mt-3 text-sm text-blue-400 hover:underline"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/10"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
