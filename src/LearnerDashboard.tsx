
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Code, 
  Heart, 
  MessageCircle, 
  ArrowRight,
  Plus,
  Calendar,
  Settings,
  Zap,
  BookOpen,
  Target,
  Search,
  Tag,
  Clock,
  Stethoscope
} from 'lucide-react';
import { useBooking } from './contexts/BookingContext';
import { NotificationDropdown } from './components/NotificationDropdown';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { useMentors } from './hooks/useData';
import { useForum } from './contexts/ForumContext';
import { GoalTracker } from './components/GoalTracker';
import { recommendMentors } from './lib/recommendations';
import logo from './assets/logo.png';

export function LearnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mentors = useMentors();
  const { posts } = useForum();
  const { getSessionsForUser } = useBooking();
  const sessions = user ? getSessionsForUser(user.id) : [];
  const nextSession = sessions.find(s => new Date(s.date) > new Date());
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const hoursMentored = completedSessions * 1;

  const profileFields = ['name', 'image', 'about', 'company', 'title', 'phone', 'country'];
  const filledFieldsCount = profileFields.reduce((count, field) => {
    return user && (user as any)[field] ? count + 1 : count;
  }, 0);
  const profileComplete = Math.round((filledFieldsCount / profileFields.length) * 100);

  const viewHistory = JSON.parse(localStorage.getItem('mentorViewHistory') || '[]');
  const recommendedMentors = recommendMentors(user, mentors, sessions, viewHistory);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';
  const userImage = user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";

  // Get consultation count
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const allConsultations = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
  const userConsultations = currentUser?.email 
    ? allConsultations.filter((b: any) => b.patientEmail === currentUser.email)
    : [];
  const consultationCount = userConsultations.length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-24 md:pb-8 min-h-screen bg-slate-50 dark:bg-[#050B0A]">
        
        {/* Mobile Header (Enhanced) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-[#050B0A]/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:border-white/5">
           <div className="flex items-center gap-3">
             <div 
                className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center border-2 border-primary/20" 
                style={{ backgroundImage: `url('${userImage}')` }}
             ></div>
             <div>
               <h1 className="text-sm font-bold text-gray-900 dark:text-white">Hi, {firstName}</h1>
               <div className="flex items-center gap-1">
                   <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                   <p className="text-xs text-gray-500 dark:text-gray-400">Level 1 Learner</p>
               </div>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <NotificationDropdown />
             <button onClick={() => navigate('/settings')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
             </button>
           </div>
        </header>

        {/* HERO SECTION (Premium Gradient) */}
        <section className="px-4 md:px-0 pt-4 md:pt-0">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0F1615] via-[#050B0A] to-[#0A0F0E] p-8 md:p-12 text-white relative overflow-hidden border border-white/5 shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
            
            {/* Hero Badge/Logo */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
              <div className="relative w-64 h-64 animate-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                  <img 
                    src={logo} 
                    alt="Bentechnology Badge" 
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-700"
                  />
                  {/* Orbiting Elements */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg animate-bounce-slow" style={{ animationDelay: '1s' }}>
                      <Code className="w-6 h-6 text-emerald-400" />
                  </div>
                   <div className="absolute bottom-10 -right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg animate-bounce-slow" style={{ animationDelay: '2s' }}>
                      <Target className="w-6 h-6 text-blue-400" />
                  </div>
              </div>
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-300">Ready to accelerate</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Find your perfect <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">mentor today.</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed font-light">
                Connect with industry experts, get career guidance, and level up your skills with 1-on-1 sessions tailored to your goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/mentorship-hub')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                   <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   Browse Mentors
                </button>
                <button 
                  onClick={() => navigate('/forum')}
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Community Forum
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* STATS & PROGRESS (Grid) */}
        <section className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1615] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{sessions.length}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sessions Completed</p>
            </div>
             <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1615] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">0h</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hours Mentored</p>
            </div>
             <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1615] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">80%</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Profile Complete</p>
            </div>
             <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer group" onClick={() => navigate('/settings')}>
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-1">Upgrade Plan</h3>
                <p className="text-indigo-100 text-sm opacity-90">Unlock premium features</p>
            </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
          
          {/* Left Column: Mentors (Carousel) */}
          <div className="lg:col-span-2 space-y-10">
            
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recommended Mentors</h2>
                </div>
                <button 
                    onClick={() => navigate('/mentorship-hub')} 
                    className="group flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-lg transition-all"
                >
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
                {recommendedMentors.slice(0, 5).map((mentor: any) => (
                  <div 
                    key={mentor.id}
                    onClick={() => navigate(`/mentor/${mentor.id}`)}
                    className="snap-center min-w-[300px] bg-white dark:bg-[#0F1615] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>

                     <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="relative">
                            <div 
                              className="w-16 h-16 rounded-2xl bg-gray-100 bg-cover bg-center border border-gray-100 dark:border-white/10 group-hover:rotate-3 transition-transform duration-500"
                              style={{ backgroundImage: `url('${mentor.image}')` }}
                            ></div>
                            {mentor.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-[#0F1615]">
                                    <CheckCircle className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            {mentor.isRecommended && (
                                <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md">
                                    Recommended for You
                                </span>
                            )}
                            <div className="flex items-center gap-1 justify-end bg-yellow-400/10 px-2 py-1 rounded-lg">
                                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs">★ {mentor.rating}</span>
                            </div>
                        </div>
                     </div>
                     
                     <div className="relative z-10">
                         <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-1 group-hover:text-emerald-500 transition-colors">{mentor.name}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1 font-medium">{mentor.role} @ {mentor.company}</p>
                         
                         <div className="flex flex-wrap gap-2 mb-6">
                           {mentor.tags.slice(0, 2).map((tag: string) => (
                             <span key={tag} className="text-[10px] items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 font-semibold">
                               {tag}
                             </span>
                           ))}
                         </div>
                         
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/mentor/${mentor.id}`);
                           }}
                           className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                         >
                           View Profile
                         </button>
                     </div>
                  </div>
                ))}
              </div>
            </section>

             {/* Recent Community Activity */}
             <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Community Pulse</h2>
                </div>
                <button onClick={() => navigate('/forum')} className="text-slate-500 hover:text-blue-500 font-bold text-sm transition-colors">Visit Forum</button>
              </div>

               <div className="space-y-4">
                 {posts.slice(0, 3).map((post) => (
                   <div key={post.id} className="group flex gap-5 p-5 rounded-[2rem] bg-white dark:bg-[#0F1615] border border-gray-100 dark:border-white/5 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer" onClick={() => navigate('/forum')}>
                      <div className="shrink-0 mt-1">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                             post.category === 'Tech' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                             post.category === 'Business' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                             'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                         }`}>
                           {post.category === 'Tech' ? <Code className="w-6 h-6" /> :
                            post.category === 'Business' ? <Tag className="w-6 h-6" /> :
                            <Heart className="w-6 h-6" />}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-2 group-hover:text-blue-500 transition-colors">{post.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                          <span className="text-slate-600 dark:text-gray-300">By {post.author}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{post.timeAgo}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1 text-slate-600 dark:text-gray-300">
                             <MessageCircle className="w-3 h-3" /> {post.answers} answers
                          </span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </section>

          </div>

          {/* Right Column: Upcoming (Secondary) */}
          <div className="space-y-6">
               <div className="bg-white dark:bg-[#0F1615] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 sticky top-24 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Coming Up</h3>
                    <Calendar className="w-5 h-5 text-gray-400" />
                 </div>

                 {nextSession ? (
                   <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-4">
                          <img src={nextSession.mentorImage} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                              <p className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{nextSession.mentorName}</p>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md inline-block">Confirmed</p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4 bg-white/50 dark:bg-black/20 p-3 rounded-xl">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(nextSession.date).toLocaleDateString()} at {new Date(nextSession.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>

                      <button className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                          Join Meeting Room
                      </button>
                   </div>
                 ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                        <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium text-sm">No upcoming sessions</p>
                        <button 
                            onClick={() => navigate('/mentorship-hub')}
                            className="mt-3 text-primary text-xs font-bold hover:underline"
                        >
                            Book a session
                        </button>
                    </div>
                 )}
                 
                 <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Quick Links</h4>
                    <div className="space-y-2">
                        <button onClick={() => navigate(user ? `/learner/${user.id}` : '/login')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-between group">
                            <span>My Profile</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                         <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-between group">
                            <span>Account Settings</span>
                             <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                 </div>
               </div>
          </div>

        </div>

        {/* Floating Action Button (Mobile Only) */}
        <div className="fixed bottom-24 right-4 z-40 md:hidden">
          <button className="flex items-center justify-center rounded-2xl size-14 bg-slate-900 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/10">
            <Plus className="w-6 h-6" />
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
