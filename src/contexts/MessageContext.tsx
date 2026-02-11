import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  participants: string[]; // User IDs
  participantDetails: { // Denormalized for display
    id: string;
    name: string;
    image: string;
  }[];
  messages: Message[];
  lastMessage: Message;
  unreadCount?: number;
}

interface MessageContextType {
  threads: Thread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendMessage: (threadId: string, content: string) => void;
  createThread: (recipientId: string, recipientName: string, recipientImage: string) => string;
  markAsRead: (threadId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Load threads
  useEffect(() => {
    const storedThreads = localStorage.getItem('threads');
    if (storedThreads) {
        setThreads(JSON.parse(storedThreads));
    }
  }, []);

  // Save threads
  useEffect(() => {
    if (threads.length > 0) {
        localStorage.setItem('threads', JSON.stringify(threads));
    }
  }, [threads]);

  const createThread = (recipientId: string, recipientName: string, recipientImage: string) => {
    if (!user) throw new Error("Must be logged in");

    // Check if thread exists
    const existingThread = threads.find(t => 
        t.participants.includes(user.id) && t.participants.includes(recipientId)
    );
    
    if (existingThread) {
        setActiveThreadId(existingThread.id);
        return existingThread.id;
    }

    const newThread: Thread = {
        id: crypto.randomUUID(),
        participants: [user.id, recipientId],
        participantDetails: [
            { id: user.id, name: user.name, image: user.image || "" },
            { id: recipientId, name: recipientName, image: recipientImage }
        ],
        messages: [],
        lastMessage: {
            id: 'init',
            senderId: 'system',
            content: 'Conversation started',
            timestamp: new Date().toISOString()
        },
        unreadCount: 0
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    return newThread.id;
  };

  const sendMessage = (threadId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
        id: crypto.randomUUID(),
        senderId: user.id,
        content,
        timestamp: new Date().toISOString()
    };

    setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
            return {
                ...t,
                messages: [...t.messages, newMessage],
                lastMessage: newMessage,
                // Increment unread for others (simplified)
            };
        }
        return t;
    }));

    // Notify others in thread
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
        thread.participants.forEach(pId => {
            if (pId !== user.id) {
                addNotification(
                    pId,
                    'message',
                    `New Message from ${user.name}`,
                    content,
                    `/messages`
                );
            }
        });
    }
  };

  const markAsRead = (_threadId: string) => {
      // Logic to clear unread count
  };

  // Filter threads for current user
  const userThreads = user ? threads.filter(t => t.participants.includes(user.id)) : [];

  return (
    <MessageContext.Provider value={{ 
        threads: userThreads, 
        activeThreadId, 
        setActiveThreadId, 
        sendMessage, 
        createThread, 
        markAsRead 
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
