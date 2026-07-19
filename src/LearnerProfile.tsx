import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share, 
  GraduationCap,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/AppLayout';
import { useBooking } from './contexts/BookingContext';
import { GoalTracker } from './components/GoalTracker';

export function LearnerProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // In a real app we'd fetch partial user data by ID, but for now we rely on AuthContext if it's "my" profile.
  // Or we find them in 'users' array in localStorage.
  const { user: authUser } = useAuth();
  
  // Try to find the user in local storage if not current auth user
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const profileUser = users.find((u) => u.id === id) || (authUser?.id === id ? authUser : null);

  const { getSessionsForUser } = useBooking();
  const sessions = profileUser ? getSessionsForUser(profileUser.id) : [];

  if (!profileUser) {
    return (
        <AppLayout>
            <div className="h-full flex items-center justify-center text-slate-900 dark:text-white pt-20">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">User Not Found</h2>
                    <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
                </div>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto md:pt-8 px-4">
        
        {/* Header */}
        <div className="relative mb-8">
            <div className="h-32 md:h-48 bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl opacity-90"></div>
            <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#050B0A] bg-gray-200 overflow-hidden shadow-xl">
                     <img 
                        src={profileUser.image} 
                        alt={profileUser.name} 
                        className="w-full h-full object-cover"
                     />
                </div>
                <div className="mb-4 ml-6 pb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {profileUser.category || 'Learner'}
                    </p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Col: Info */}
            <div className="md:col-span-1 space-y-6">
                 <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">About</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {profileUser.about || "This user hasn't written a bio yet."}
                    </p>
                 </div>
                 
                 <GoalTracker goals={profileUser.learningGoals || []} />
            </div>

            {/* Right Col: Stats / Activity */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{sessions.length}</span>
                        </div>
                        <p className="text-sm text-gray-500">Mentorship Sessions</p>
                     </div>
                     <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {sessions.reduce((acc, curr) => acc + 1, 0)}h
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">Learning Hours</p>
                     </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                     {sessions.length > 0 ? (
                         <div className="space-y-4">
                            {sessions.slice(0, 3).map((session, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Mentorship Session</p>
                                        <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="ml-auto px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-lg font-medium">
                                        Completed
                                    </span>
                                </div>
                            ))}
                         </div>
                     ) : (
                         <p className="text-gray-500 text-sm italic">No recent activity to show.</p>
                     )}
                </div>

            </div>

        </div>
      </div>
    </AppLayout>
  );
}
