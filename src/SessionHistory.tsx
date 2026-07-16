import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search, Calendar, Video, Star } from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { useBooking } from './contexts/BookingContext';

export function SessionHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSessionsForUser } = useBooking();
  
  const sessions = user ? getSessionsForUser(user.id) : [];
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session => {
    if (filterStatus !== 'all' && session.status !== filterStatus) return false;
    if (searchQuery && !session.mentorName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session History</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review all your past and upcoming mentorship sessions.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F1615] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white"
              />
            </div>
            
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F1615] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F1615] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
          {filteredSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentor</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={session.mentorImage} alt={session.mentorName} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{session.mentorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(session.date).toLocaleDateString()} <br/>
                            <span className="text-xs text-gray-500">{new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {session.type || 'General Mentorship'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          session.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                          session.status === 'upcoming' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400' :
                          'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-500/10 dark:border-gray-500/20 dark:text-gray-400'
                        }`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {session.status === 'upcoming' ? (
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors">
                            <Video className="w-4 h-4" /> Join
                          </button>
                        ) : session.status === 'completed' ? (
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                            <Star className="w-4 h-4" /> Review
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <Calendar className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No sessions found</h3>
              <p className="text-gray-500 max-w-md">You haven't booked any sessions yet, or none match your current filters.</p>
              <button 
                onClick={() => navigate('/mentorship-hub')}
                className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
              >
                Find a Mentor
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
