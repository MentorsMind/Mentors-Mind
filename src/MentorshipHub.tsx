import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  Search, 
  Check, 
  Plus,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { useMentors } from './hooks/useData';
import { AppLayout } from './components/AppLayout';
import { BookingModal } from './components/BookingModal';
import { useAuth } from './contexts/AuthContext';

export function MentorshipHub() {
  const [filter, setFilter] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const mentors = useMentors();

  const filteredMentors = mentors.filter((mentor: any) => {
    const matchesCategory = filter === 'All' || mentor.category === filter;
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="flex flex-col relative min-h-screen bg-slate-50 dark:bg-[#050B0A] pb-20">
        
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-12 px-4 overflow-hidden rounded-b-[3rem] bg-[#050B0A] mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-blue-900/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center">
                 {/* Mobile Header (in-hero) */}
                <div className="flex md:hidden items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate('/learner-dashboard')}
                        className="p-2 rounded-full bg-white/10 text-white backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full bg-white/10 text-white backdrop-blur-md relative">
                             <Bell className="w-5 h-5" />
                             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                        </button>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 backdrop-blur-md">
                    <Award className="w-3 h-3" />
                    <span>Top Rated Mentors</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Find Your <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Perfect Guide.</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                    Connect with industry leaders, gain actionable insights, and accelerate your career growth with 1-on-1 mentorship sessions.
                </p>

                {/* SEARCH BAR (Floating) */}
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative flex items-center bg-white/10 dark:bg-[#0F1615] border border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                        <div className="pl-4 pr-2">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search mentors by name, company, or role..."
                            className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm md:text-base h-10"
                        />
                        <button className="hidden sm:flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 w-full">
            {/* FILTERS & STATS ROW */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-20 md:top-0 z-20 md:relative">
                 {/* Filter Chips - Glass styling */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar p-1">
                    {['All', 'Tech', 'Business', 'Medical'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md whitespace-nowrap ${
                                filter === cat 
                                ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 dark:border-white shadow-lg' 
                                : 'bg-white/80 dark:bg-[#0F1615] border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{filteredMentors.length} Mentors available</span>
                </div>
            </div>

            {/* MENTOR GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredMentors.map((mentor: any) => (
                    <div 
                        key={mentor.id}
                        onClick={() => user ? navigate(`/mentor/${mentor.id}`) : navigate('/signup')}
                        className="group relative bg-white dark:bg-[#0F1615] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 dark:hover:shadow-black/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                             <div className="relative">
                                {/* Improved Avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 p-1">
                                    <div className="w-full h-full rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url("${mentor.image}")` }}></div>
                                </div>
                                {mentor.verified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-[#0F1615] shadow-sm">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                )}
                             </div>
                             <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 group-hover:border-yellow-500/30 transition-colors">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-gray-200">{mentor.rating}</span>
                                </span>
                             </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{mentor.name}</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{mentor.role} @ <span className="text-slate-700 dark:text-gray-300 font-semibold">{mentor.company}</span></p>
                            
                            {/* Skills/Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {mentor.specializations?.slice(0, 2).map((spec: any, i: number) => (
                                    <span key={i} className="text-[10px] items-center px-2.5 py-1 rounded-full bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/10">
                                        {spec.name}
                                    </span>
                                ))}
                                {mentor.tags?.length > 0 && !mentor.specializations && mentor.tags.slice(0, 2).map((tag: any, i: number) => (
                                     <span key={i} className="text-[10px] items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5">
                                        {tag}
                                     </span>
                                ))}
                                {(mentor.specializations?.length > 2) && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400">+{mentor.specializations.length - 2}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-bold text-slate-600 dark:text-white transition-colors">
                                    View Profile
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (user) {
                                            setSelectedMentor(mentor);
                                            setIsBookingOpen(true);
                                        } else {
                                            navigate('/signup');
                                        }
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-slate-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMentors.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white mb-2">No mentors found</h2>
                    <p className="text-gray-500">We couldn't find any mentors matching "{searchQuery}"</p>
                    <button 
                        onClick={() => {setFilter('All'); setSearchQuery('');}}
                        className="mt-6 text-emerald-500 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                 </div>
            )}
        </div>

        {/* Floating Action Button (Mobile) */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button className="flex items-center justify-center rounded-2xl size-14 bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {selectedMentor && (
          <BookingModal 
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            mentorId={selectedMentor.id}
            mentorName={selectedMentor.name}
            mentorImage={selectedMentor.image}
          />
        )}
      </div>
    </AppLayout>
  );
}
