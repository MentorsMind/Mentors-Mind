import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share, 
  Check, 
  PlayCircle, 
  Star
} from 'lucide-react';
import { useMentors } from './hooks/useData';
import { AppLayout } from './components/AppLayout';
import { BookingModal } from './components/BookingModal';
import { ConsultationBookingModal } from './components/ConsultationBookingModal';
import { EditProfileModal } from './components/EditProfileModal';
import { useAuth } from './contexts/AuthContext';

export function MentorProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showTitle, setShowTitle] = useState(false);
  const { user, updateUser } = useAuth();
  const mentors = useMentors();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  // Note: Profiles are now publicly viewable - no authentication required

  let mentor = mentors.find(m => m.id === id);

  // Fallback: If viewing own profile and not found in public directory (e.g. newly signed up or demo)
  if (!mentor && user && user.id === id && user.role === 'mentor') {
      mentor = {
          id: user.id,
          name: user.name,
          role: user.title || 'Mentor',
          company: user.company || 'MentorMinds',
          image: user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor',
          about: user.about || 'Welcome to my profile.',
          rating: 5.0,
          reviews: [],
          sessions: 0,
          experienceYears: 1,
          verified: user.verified || false,
          tags: ['Mentor'],
          category: user.category || 'Tech',
          specializations: user.specializations || [],
          hourlyRate: 0,
          phone: user.phone,
          state: user.state,
          country: user.country,
          experience: [],
          tips: user.tips || []
      };
  }

  const handlePostTip = async () => {
    if (!newTip.trim() || !user) return;
    setLoadingTip(true);
    try {
        const tip = {
            id: Date.now().toString(),
            content: newTip,
            createdAt: new Date().toISOString(),
            likes: 0
        };
        const updatedTips = [tip, ...(user.tips || [])];
        await updateUser({ tips: updatedTips });
        setNewTip('');
    } catch (e) {
        console.error("Failed to post tip", e);
    } finally {
        setLoadingTip(false);
    }
  };



  useEffect(() => {
    if (mentor) {
      const viewHistory = JSON.parse(localStorage.getItem('mentorViewHistory') || '[]');
      const existingIndex = viewHistory.findIndex((v: any) => v.mentorId === mentor.id);
      if (existingIndex > -1) {
          viewHistory[existingIndex].viewedAt = new Date().toISOString();
      } else {
          viewHistory.push({ mentorId: mentor.id, viewedAt: new Date().toISOString() });
      }
      localStorage.setItem('mentorViewHistory', JSON.stringify(viewHistory));
    }
  }, [mentor?.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTitle(true);
      } else {
        setShowTitle(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mentor) {
    return (
        <AppLayout>
            <div className="h-full flex items-center justify-center text-slate-900 dark:text-white pt-20">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Mentor Not Found</h2>
                    <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
                </div>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto md:pt-4">
        <BookingModal 
           isOpen={isBookingModalOpen}
           onClose={() => setIsBookingModalOpen(false)}
           mentorId={mentor.id}
           mentorName={mentor.name}
           mentorImage={mentor.image}
        />
        <ConsultationBookingModal 
           isOpen={isConsultationModalOpen}
           onClose={() => setIsConsultationModalOpen(false)}
           doctorId={mentor.id}
           doctorName={mentor.name}
           doctorImage={mentor.image}
           consultationFee={mentor.hourlyRate || 0}
           specializations={mentor.tags || []}
        />
        <EditProfileModal 
           isOpen={isEditProfileOpen}
           onClose={() => setIsEditProfileOpen(false)}
        />
        
        {/* Mobile Top App Bar */}
        <div className="sticky top-0 z-50 flex items-center justify-between p-4 -mx-4 mb-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md md:hidden border-b border-gray-200 dark:border-white/5">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h2 className={`text-base font-bold tracking-tight transition-opacity duration-300 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
            {mentor.name}
          </h2>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <Share className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 relative">
            
            {/* Main Content (Left Column) */}
            <div className="md:col-span-2 space-y-8 pb-32 md:pb-0">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center md:items-start md:flex-row gap-6 px-4 md:px-0">
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background-light dark:border-background-dark shadow-xl ring-2 ring-primary/20">
                            <img 
                                alt={`Portrait of ${mentor.name}`}
                                className="w-full h-full object-cover" 
                                src={mentor.image}
                            />
                        </div>
                        {mentor.verified && (
                            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-background-light dark:bg-background-dark rounded-full p-1">
                                <div className="bg-primary text-white rounded-full p-1 flex items-center justify-center" title="Verified Mentor">
                                    <Check className="w-3 h-3" strokeWidth={4} />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center md:text-left space-y-2 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                    {mentor.name}
                                </h1>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3">
                                  <p className="text-primary font-medium text-sm md:text-base">{mentor.role} at {mentor.company}</p>

                                </div>
                                {user && user.id === mentor.id && (
                                   <button 
                                      onClick={() => setIsEditProfileOpen(true)}
                                      className="mt-2 text-xs font-bold bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                                   >
                                      Edit Profile
                                   </button>
                                )}
                                {mentor.specializations && mentor.specializations.length > 0 && (
                                   <div className="flex flex-wrap gap-2 mb-4">
                                      {mentor.specializations.map((spec: any, i: number) => (
                                          <span 
                                              key={i} 
                                              className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-semibold border border-green-100 dark:border-green-800"
                                          >
                                              {spec.name} - ₦{spec.price}/month
                                          </span>
                                      ))}
                                   </div>
                                )}
                            </div>
                            {/* Share button desktop */}
                            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1a2e22] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 shadow-sm">
                                <Share className="w-5 h-5 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
                            {mentor.about}
                        </p>

                        {/* Location & Contact Info */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm text-gray-500 dark:text-gray-400">
                            {(mentor.state || mentor.country) && (
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{[mentor.city, mentor.state, mentor.country].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                            {mentor.phone && (
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    <span>{mentor.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Mobile Only) */}
                <div className="flex gap-3 px-4 md:hidden w-full justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1c2e24] text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        <PlayCircle className="w-[18px] h-[18px]" />
                        Intro Video
                    </button>

                </div>

                {/* Stats Row */}
                <div className="px-4 md:px-0">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-[#1c2e24] shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-1 text-primary mb-1">
                                <span className="text-lg font-bold">{mentor.rating}</span>
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rating</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-[#1c2e24] shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{mentor.sessions}+</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sessions</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-[#1c2e24] shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{mentor.experienceYears}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Experience</p>
                        </div>
                    </div>
                </div>

                {/* Expertise Section */}
                <div className="px-4 md:px-0">
                    <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                        {mentor.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                            {tag}
                        </span>
                        ))}
                    </div>
                </div>

                {/* Mentor Tips / Updates Section */}
                <div className="px-4 md:px-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Mentor Tips & Updates</h3>
                    </div>

                    {/* Post Input (Only for Owner) */}
                    {user && user.id === mentor.id && (
                        <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Share a new tip or update</label>
                            <textarea
                                value={newTip}
                                onChange={(e) => setNewTip(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none dark:text-white"
                                placeholder="Share your knowledge with the community..."
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={handlePostTip}
                                    disabled={!newTip.trim() || loadingTip}
                                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                >
                                    {loadingTip ? 'Posting...' : 'Post Update'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tips List */}
                    <div className="space-y-4">
                        {mentor.tips && mentor.tips.length > 0 ? (
                            mentor.tips.map((tip: any) => (
                                <div key={tip.id} className="p-5 rounded-xl bg-white dark:bg-[#1c2e24] shadow-sm border border-gray-100 dark:border-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-white/10">
                                            <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{mentor.name}</h4>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(tip.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {tip.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No tips shared yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Experience Timeline */}
                {mentor.experience && mentor.experience.length > 0 && (
                    <div className="px-4 md:px-0">
                        <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white">Experience</h3>
                        <div className="relative pl-2 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-white/10">
                            {mentor.experience.map((exp: any) => (
                                <div key={exp.id} className="relative pl-10">
                                <div className="absolute left-0 top-1 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center z-10">
                                    <img 
                                    className="w-6 h-6 object-contain opacity-80" 
                                    alt={`${exp.company} Logo`} 
                                    src={exp.logo}
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/24x24?text=LG')}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{exp.duration}</p>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Carousel */}
                {mentor.reviews && mentor.reviews.length > 0 && (
                    <div>
                        <div className="px-4 md:px-0 flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Reviews ({mentor.reviews.length})</h3>
                            <a className="text-xs font-semibold text-primary" href="#">See All</a>
                        </div>
                        <div className="flex overflow-x-auto gap-4 px-4 pb-4 md:px-0 no-scrollbar snap-x snap-mandatory">
                            {mentor.reviews.map((review: any) => (
                                <div key={review.id} className="snap-center shrink-0 w-[280px] p-5 rounded-xl bg-white dark:bg-[#1c2e24] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between h-auto">
                                <div>
                                    <div className="flex gap-1 text-primary mb-3">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic line-clamp-3">
                                    "{review.text}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                    <img className="w-full h-full object-cover" alt={`Portrait of ${review.author}`} src={review.image} />
                                    </div>
                                    <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{review.author}</p>
                                    <p className="text-[10px] text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Sticky Booking Card (Right Column) */}
            <div className="hidden md:block col-span-1">
                <div className="sticky top-6 bg-white dark:bg-[#1a2e22] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                    <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-white/5 pb-4">
                        {mentor.category === 'Medical' ? (
                          <div>
                            <span className="text-sm text-slate-600 dark:text-gray-400 block mb-1">Consultation Fee</span>
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{mentor.hourlyRate.toLocaleString()}</span>
                          </div>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">₦{mentor.hourlyRate}</span>
                            <span className="text-gray-500 font-medium">/ month</span>
                          </>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                          <button 
                            onClick={() => mentor.category === 'Medical' ? setIsConsultationModalOpen(true) : setIsBookingModalOpen(true)} 
                            className="w-full bg-primary hover:bg-green-600 text-white font-bold h-12 rounded-xl transition-colors shadow-lg shadow-primary/20"
                          >
                             {mentor.category === 'Medical' ? 'Book Consultation' : 'Request Mentorship'}
                         </button>

                         <button className="w-full bg-transparent text-gray-500 dark:text-gray-400 font-medium h-10 rounded-xl hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
                             <PlayCircle className="w-5 h-5" />
                             Watch Intro
                         </button>
                    </div>

                    <div className="text-xs text-gray-400 text-center">
                        Average response time: 2 hours
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Booking Bar - Hidden on Desktop */}
            <div className="fixed bottom-0 left-0 right-0 w-full z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent md:hidden">
                <div className="max-w-md mx-auto flex items-center gap-4 bg-white dark:bg-[#1c2e24] p-2 pr-3 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
                    <div className="flex flex-col pl-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{mentor.category === 'Medical' ? 'Consultation Fee' : 'Starting at'}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">₦{mentor.hourlyRate.toLocaleString()}</span>
                        {mentor.category !== 'Medical' && <span className="text-xs text-gray-500">/month</span>}
                    </div>
                    </div>
                    <button 
                      onClick={() => mentor.category === 'Medical' ? setIsConsultationModalOpen(true) : setIsBookingModalOpen(true)} 
                      className="flex-1 bg-primary hover:bg-green-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {mentor.category === 'Medical' ? 'Book Consultation' : 'Request Mentorship'}
                    </button>
                </div>
            </div>

        </div>
      </div>
    </AppLayout>
  );
}
