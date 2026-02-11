import React, { useRef, useState, useEffect } from 'react';
import { Bell, Check, Info, MessageSquare, Calendar } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    setIsOpen(false);
    if (link) navigate(link);
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'booking': return <Calendar className="w-4 h-4 text-blue-500" />;
        case 'message': return <MessageSquare className="w-4 h-4 text-green-500" />;
        case 'reply': return <MessageSquare className="w-4 h-4 text-purple-500" />;
        default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2e22]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a2e22] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs text-primary font-medium hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map(n => (
                        <div 
                            key={n.id}
                            onClick={() => handleNotificationClick(n.id, n.link)}
                            className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 last:border-0 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        >
                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-white dark:bg-white/10' : 'bg-gray-100 dark:bg-white/5'}`}>
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm ${!n.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                    {n.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {n.message}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-2 block">
                                    {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            {!n.read && (
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
      )}
    </div>
  );
}
