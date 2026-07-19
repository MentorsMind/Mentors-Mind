import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useNotifications } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import type { AppNotification } from './types';

export function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'reply':
        return <MessageSquare className="w-5 h-5" />;
      case 'system':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'message':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'reply':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'system':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  notification.read
                    ? 'bg-white dark:bg-[#1a2e22] border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl border ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        notification.read 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                        Click to view →
                      </p>
                    )}
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notifications yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              When you get notifications about bookings, messages, or updates, they'll appear here.
            </p>
          </div>
        )}

        {/* Demo Notification Generator (for testing) */}
        {user && notifications.length === 0 && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Demo Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Notifications will appear here when:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>Someone books a session with you (mentors)</li>
              <li>You receive a new message</li>
              <li>Someone replies to your forum post</li>
              <li>System updates or announcements</li>
            </ul>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
