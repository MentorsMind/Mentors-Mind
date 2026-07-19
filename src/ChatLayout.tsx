import { useState, useEffect, useRef } from 'react';
import { useMessages } from './contexts/MessageContext';
import { useAuth } from './contexts/AuthContext';
import { Send, MoreVertical, Phone, Video, Search, ChevronLeft, Check, CheckCheck } from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import type { Message } from './contexts/MessageContext';

export function ChatLayout() {
  const { user } = useAuth();
  const { threads, activeThreadId, setActiveThreadId, sendMessage, markAsRead } = useMessages();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [otherTyping, setOtherTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeenAgo, setLastSeenAgo] = useState<number | null>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const otherParticipant = activeThread?.participantDetails.find(p => p.id !== user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages]);

  useEffect(() => {
    if (activeThreadId) {
      markAsRead(activeThreadId);
    }
  }, [activeThreadId, activeThread?.messages?.length]);

  useEffect(() => {
    if (!activeThreadId || !otherParticipant || !user) return;

    const polling = setInterval(() => {
      const typingKey = `typing_${activeThreadId}_${otherParticipant.id}`;
      const typingTs = localStorage.getItem(typingKey);
      const now = Date.now();
      const isTypingNow = typingTs !== null && now - Number(typingTs) < 2000;
      setOtherTyping(isTypingNow);

      const lastSeenKey = `lastSeen_${otherParticipant.id}`;
      const lastSeen = localStorage.getItem(lastSeenKey);
      const isOnlineNow = (lastSeen !== null && now - Number(lastSeen) < 30000) || isTypingNow;
      setIsOnline(isOnlineNow);

      if (!isTypingNow && lastSeen !== null) {
        setLastSeenAgo(now - Number(lastSeen));
      } else {
        setLastSeenAgo(null);
      }
    }, 500);

    return () => {
      clearInterval(polling);
    };
  }, [activeThreadId, otherParticipant, user]);

  useEffect(() => {
    if (!activeThreadId || !user) return;

    const typingKey = `typing_${activeThreadId}_${user.id}`;
    localStorage.setItem(typingKey, Date.now().toString());

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      localStorage.removeItem(typingKey);
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputText, activeThreadId, user]);

  useEffect(() => {
    return () => {
      if (activeThreadId && user) {
        localStorage.removeItem(`typing_${activeThreadId}_${user.id}`);
        localStorage.setItem(`lastSeen_${user.id}`, Date.now().toString());
      }
    };
  }, [activeThreadId, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;
    sendMessage(activeThreadId, inputText);
    setInputText('');
    if (user) {
      localStorage.removeItem(`typing_${activeThreadId}_${user.id}`);
    }
  };

  const formatLastSeen = (ms: number): string => {
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return 'last seen just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `last seen ${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `last seen ${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `last seen ${days}d ago`;
  };

  const statusIcon = (msg: Message) => {
    if (msg.senderId !== user?.id || !otherParticipant) return null;
    if (msg.readBy.includes(otherParticipant.id)) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
    if (isOnline) {
      return <CheckCheck className="w-3 h-3 text-white/60" />;
    }
    return <Check className="w-3 h-3 text-white/60" />;
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">

        {/* Sidebar - Thread List */}
        <div className={`w-full md:w-80 border-r border-gray-100 dark:border-white/5 flex flex-col ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <label htmlFor="chat-search" className="sr-only">Search chats</label>
                <input
                    id="chat-search"
                    type="text"
                    placeholder="Search chats..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No conversations yet. Book a session or request mentorship to start chatting!
                </div>
            ) : (
                threads.map(thread => {
                    const participant = thread.participantDetails.find(p => p.id !== user?.id);
                    return (
                        <button
                            key={thread.id}
                            onClick={() => setActiveThreadId(thread.id)}
                            className={`w-full text-left p-4 flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${activeThreadId === thread.id ? 'bg-primary/5 border-r-4 border-primary' : ''}`}
                            aria-label={`Open chat with ${participant?.name}`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full bg-cover bg-center bg-gray-200" style={{ backgroundImage: `url('${participant?.image}')` }}></div>
                                {thread.unreadCount ? (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a2e22]">
                                        {thread.unreadCount}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{participant?.name}</h3>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(thread.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${thread.unreadCount ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {thread.lastMessage.senderId === user?.id ? 'You: ' : ''}{thread.lastMessage.content}
                                </p>
                            </div>
                        </button>
                    );
                })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {activeThread ? (
             <div className={`flex-1 flex flex-col ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveThreadId(null)} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Back to messages">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-cover bg-center bg-gray-200" style={{ backgroundImage: `url('${otherParticipant?.image}')` }}></div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{otherParticipant?.name}</h3>
                            {otherTyping ? (
                              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                typing...
                              </span>
                            ) : isOnline ? (
                              <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Online
                              </span>
                            ) : lastSeenAgo !== null ? (
                              <span className="text-xs text-gray-400">
                                {formatLastSeen(lastSeenAgo)}
                              </span>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Voice call">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Video call">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="More options">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
                    {activeThread.messages.map(msg => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                                    isMe
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white dark:bg-[#25382e] text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? '' : 'opacity-70'}`}>
                                      <span className="text-[10px]">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                      {statusIcon(msg)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-[#1a2e22] border-t border-gray-100 dark:border-white/5">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <label htmlFor="message-input" className="sr-only">Type a message</label>
                        <input
                            id="message-input"
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/20 border border-transparent focus:border-primary/30 outline-none text-gray-900 dark:text-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-3 rounded-xl bg-primary text-white hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-lg shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            aria-label="Send message"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
             </div>
        ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 text-gray-400">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">Select a conversation</h3>
                <p>Choose a thread from the sidebar to start chatting</p>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
