"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { 
  Notification as AppNotification, 
  NotificationPreferences 
} from '@/lib/notifications';
import { 
  generateDemoNotifications, 
  defaultPreferences 
} from '@/lib/notifications';

interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  preferences: NotificationPreferences;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  refresh: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const socketRef = useRef<Socket | null>(null);

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = () => {
      setLoading(true);
      // Load demo notifications
      setTimeout(() => {
        setNotifications(generateDemoNotifications());
        setLoading(false);
      }, 300);
    };

    loadNotifications();

    // Connect to Socket.io for real-time notifications
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';
    
    try {
      socketRef.current = io(socketUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      socketRef.current.on('connect', () => {
        console.log('📬 Connected to notification service');
      });

      // Listen for new notifications
      socketRef.current.on('notification', (newNotification: AppNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show browser notification if enabled
        if (preferences.push && 'Notification' in window) {
          if (window.Notification.permission === 'granted') {
            new window.Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
            });
          }
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('📭 Disconnected from notification service');
      });
    } catch (error) {
      console.log('Socket connection not available, using demo mode');
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [preferences.push]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  // Refresh notifications
  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(generateDemoNotifications());
      setLoading(false);
    }, 500);
  }, []);

  return {
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
  };
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }

  if (window.Notification.permission === 'granted') {
    return true;
  }

  if (window.Notification.permission !== 'denied') {
    const permission = await window.Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Send a test notification
export function sendTestNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
    new window.Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
}
