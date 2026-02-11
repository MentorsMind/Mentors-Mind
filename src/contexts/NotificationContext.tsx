import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'reply' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (userId: string, type: Notification['type'], title: string, message: string, link?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else if (user) {
      // Add demo notifications for new users
      const demoNotifications: Notification[] = [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          type: 'system',
          title: 'Welcome to MentorMinds! 🎉',
          message: 'Your account has been successfully created. Start exploring mentors and book your first session!',
          link: '/mentorship-hub',
          read: false,
          timestamp: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          type: 'booking',
          title: 'Complete Your Profile',
          message: 'Add more details to your profile to help mentors understand your goals better.',
          link: '/settings',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          type: 'message',
          title: 'New Feature: Wallet System',
          message: user.role === 'mentor' 
            ? 'Track your earnings and request payouts from your new wallet dashboard!' 
            : 'You can now view your booking history and manage payments easily.',
          link: user.role === 'mentor' ? '/mentor/wallet' : '/learner-dashboard',
          read: false,
          timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        }
      ];
      setNotifications(demoNotifications);
    }
  }, [user]);

  // Save notifications
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const userNotifications = user 
    ? notifications
        .filter(n => n.userId === user.id) 
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];
    
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const addNotification = (userId: string, type: Notification['type'], title: string, message: string, link?: string) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message,
      link,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => 
      n.userId === user.id ? { ...n, read: true } : n
    ));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications: userNotifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
