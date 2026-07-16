import { useState } from 'react';
import { 
  Video, 
  MessageSquare, 
  Star, 
  Reply, 
  Calendar,
  Clock,
  Settings,
  Wallet
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { useMentorStats } from './hooks/useMentorStats';
import { useBooking } from './contexts/BookingContext';
import { useForum } from './contexts/ForumContext';
import { NotificationDropdown } from './components/NotificationDropdown';
import { SessionResources } from './components/SessionResources';

import { EditProfileModal } from './components/EditProfileModal';

export function MentorDashboard() {
  const { user } = useAuth();
  const { getSessionsForUser } = useBooking();
  const { posts } = useForum();
  const sessions = user ? getSessionsForUser(user.id) : [];
  const nextSession = sessions.find(s => new Date(s.date) > new Date());
  
  // Merge stats with real session count and forum posts
  const stats = {
      ...useMentorStats(user?.id),
      sessions: sessions.length,
      questions: posts.map(p => ({
        id: p.id,
        author: p.author,
        text: p.title,
        time: p.timeAgo,
        tags: [p.category],
        image: p.authorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author}`
      }))
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<'details' | 'expertise'>('details');
  
  const firstName = user?.name ? user.name.split(' ')[0] : 'Mentor';
  const userImage = user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor";

  return (
    <AppLayout>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialTab={editModalTab}
      />
      <div className="flex flex-col gap-6 md:gap-8 pb-20 md:pb-0">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-0 bg-white/80 dark:bg-[#1a2e22]/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none sticky top-0 z-30 md:relative border-b md:border-none border-gray-100 dark:border-white/5 mx-[-16px] md:mx-0 px-6 md:px-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group cursor-pointer shrink-0" onClick={() => { setEditModalTab('details'); setIsEditModalOpen(true); }}>
              <div 
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center ring-2 ring-white dark:ring-[#1a2e22] shadow-sm transition-transform group-hover:scale-105" 
                style={{ backgroundImage: `url('${userImage}')` }}
              >
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#1a2e22]"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                 <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hi, {firstName}</h1>
              </div>
              <h1 className="text-sm text-gray-500 dark:text-gray-400 font-medium">Welcome back,</h1>
              <div className="flex items-center gap-2">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">Dr. {firstName} 👋</h2>
              </div>
            </div>
            <div className="ml-auto md:hidden flex items-center gap-2">
                 <NotificationDropdown />
                 <button onClick={() => window.location.href='/settings'} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <Settings className="w-5 h-5" />
                 </button>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <button 
                onClick={() => { setEditModalTab('details'); setIsEditModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25382e] hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm"
            >
                Edit Public Profile
            </button>
            <NotificationDropdown />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0 mx-[-16px] md:mx-0">
            {/* Left Column: Stats & Requests */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* Stats */}
                <section aria-label="Quick Statistics">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2 rounded-2xl p-5 bg-white dark:bg-[#1a2e22] shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-all group">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sessions</span>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stats.sessions}</p>
                            </div>
                        </div>
                        <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2 rounded-2xl p-5 bg-white dark:bg-[#1a2e22] shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 transition-all group">
                             <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Answers Given</span>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stats.answers}</p>
                            </div>
                        </div>
                         <div className="flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2 rounded-2xl p-5 bg-white dark:bg-[#1a2e22] shadow-sm border border-gray-100 dark:border-gray-800 hover:border-amber-500/30 transition-all group">
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <Star className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Rating</span>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stats.rating}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Requests */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mentorship Requests</h3>
                             <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{stats.requests.length} new</span>
                        </div>
                        <button className="text-sm font-semibold text-primary hover:text-green-700 transition-colors">See all</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.requests.map((req) => (
                             <div key={req.id} className="group relative flex flex-col bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                <div className="h-24 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 relative">
                                    <div className="absolute top-4 right-4 text-xs font-medium text-gray-500 bg-white/50 backdrop-blur px-2 py-1 rounded-lg">
                                        2h ago
                                    </div>
                                    <div className="absolute -bottom-6 left-5 border-[3px] border-white dark:border-[#1a2e22] rounded-2xl overflow-hidden size-16 shadow-md bg-white">
                                        <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url('${req.image}')` }}></div>
                                    </div>
                                </div>
                                <div className="p-5 pt-8 flex flex-col gap-3">
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {req.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 uppercase tracking-wide border border-gray-200 dark:border-white/5">{tag}</span>
                                            ))}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{req.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{req.role}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button className="py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Decline</button>
                                        <button className="py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-green-600 shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]">Accept</button>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Column: Questions / Calendar */}
            <div className="space-y-6 md:space-y-8">
                 {/* Quick Actions */}
                 <section className="p-5 rounded-3xl bg-white dark:bg-[#1a2e22] border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.href = '/mentor/wallet'}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 hover:from-emerald-100 hover:to-blue-100 dark:hover:from-emerald-900/30 dark:hover:to-blue-900/30 border border-emerald-200 dark:border-emerald-800/30 transition-all group text-left"
                        >
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">My Wallet</p>
                                    <p className="text-xs text-gray-500">View earnings & payouts</p>
                                </div>
                             </div>
                        </button>
                        <button 
                            onClick={() => {
                                setEditModalTab('expertise');
                                setIsEditModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group text-left"
                        >
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Manage Expertise</p>
                                    <p className="text-xs text-gray-500">Update rates & skills</p>
                                </div>
                             </div>
                        </button>
                    </div>
                 </section>

                 {/* Questions */}
                 <section>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Questions</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                         {stats.questions.map((q) => (
                             <div key={q.id} className="p-4 rounded-2xl bg-white dark:bg-[#1a2e22] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 transition-colors group cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-full bg-cover bg-center shrink-0 ring-2 ring-gray-50 dark:ring-white/5" style={{ backgroundImage: `url('${q.image}')` }}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                             <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">{q.author}</p>
                                             <span className="text-[10px] font-medium text-gray-400">{q.time}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug mb-3 line-clamp-2">{q.text}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1.5">
                                                {q.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">#{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                                <Reply className="w-3.5 h-3.5" />
                                                Reply
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         ))}
                    </div>
                 </section>

                 {/* Upcoming Session (Mini) */}
                 {nextSession ? (
                    <section className="p-5 rounded-3xl bg-gradient-to-br from-[#E8F5E9] to-[#E3F2FD] dark:from-[#1a2e22] dark:to-[#0f1d16] border border-white/50 dark:border-white/5 relative overflow-hidden">
                        {/* Decorative Blur */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                                <Calendar className="w-5 h-5" />
                                <h3>Next Session</h3>
                            </div>
                            <div className="bg-white/60 dark:bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-cover bg-center shadow-sm" style={{ backgroundImage: `url('${nextSession.learnerImage}')` }}></div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{nextSession.learnerName}</p>
                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mt-0.5">{nextSession.topic.substring(0, 15)}...</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-white/5 p-2 rounded-xl">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{new Date(nextSession.date).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-green-900/10 hover:bg-green-600 transition-colors">
                                    Join Meeting
                                </button>
                                <SessionResources sessionId={nextSession.id} isMentor={true} />
                            </div>
                        </div>
                    </section>
                 ) : (
                    <section className="p-5 rounded-3xl bg-gray-50 dark:bg-[#1a2e22] border border-dashed border-gray-200 dark:border-white/10 text-center">
                        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">No upcoming sessions</h3>
                        <p className="text-xs text-gray-500">Bookings will appear here.</p>
                    </section>
                 )}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
