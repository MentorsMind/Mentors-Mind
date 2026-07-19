import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Award,
  Lightbulb,
  Settings,
  Activity,
  Heart,
  Eye,
  Bell
} from 'lucide-react';
import type { MedicalProfessional, ConsultationBooking } from './data';
import { BarChart } from './components/charts/BarChart';
import { LineChart } from './components/charts/LineChart';
import { DonutChart } from './components/charts/DonutChart';

export function MedicalDashboard() {
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<MedicalProfessional | null>(null);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'analytics' | 'contributions'>('overview');
  const [completionNotes, setCompletionNotes] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Get logged-in medical professional from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || !currentUser.email) {
      navigate('/medical-registration');
      return;
    }

    // Find medical professional by email
    const medicalProfessionals = JSON.parse(localStorage.getItem('medicalProfessionals') || '[]');
    const prof = medicalProfessionals.find((p: MedicalProfessional) => p.email === currentUser.email);
    
    if (!prof) {
      navigate('/medical-registration');
      return;
    }

    setProfessional(prof);

    // Load consultation bookings for this doctor
    const allBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
    const doctorBookings = allBookings.filter((b: ConsultationBooking) => b.doctorId === prof.id);
    setBookings(doctorBookings);
  }, [navigate]);

  const handleBookingAction = (bookingId: string, action: 'accepted' | 'declined') => {
    const allBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
    const updatedBookings = allBookings.map((b: ConsultationBooking) =>
      b.id === bookingId ? { ...b, status: action } : b
    );
    localStorage.setItem('consultationBookings', JSON.stringify(updatedBookings));
    
    // Update local state
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: action } : b));
  };

  const handleCompleteConsultation = (bookingId: string) => {
    const notes = completionNotes[bookingId] || '';
    const allBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
    const updatedBookings = allBookings.map((b: ConsultationBooking) =>
      b.id === bookingId ? { 
        ...b, 
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        completedNotes: notes
      } : b
    );
    localStorage.setItem('consultationBookings', JSON.stringify(updatedBookings));
    
    // Update local state
    setBookings(bookings.map(b => 
      b.id === bookingId ? { 
        ...b, 
        status: 'completed' as const
      } : b
    ));
    
    // Clear notes
    setCompletionNotes(prev => {
      const newNotes = {...prev};
      delete newNotes[bookingId];
      return newNotes;
    });
  };

  if (!professional) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.length * professional.consultationFee;

  // Analytics Data Preparation
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({length: 6}, (_, i) => {
    let m = currentMonth - 5 + i;
    if (m < 0) m += 12;
    return monthNames[m];
  });

  // 1. Consultations per month (since week is hard to fake well without actual dates, we'll do months)
  const consultationCounts = last6Months.map(m => ({ label: m, value: 0 }));
  completedBookings.forEach(b => {
    const d = new Date(b.date || b.createdAt);
    const mName = monthNames[d.getMonth()];
    const mIndex = consultationCounts.findIndex(x => x.label === mName);
    if (mIndex !== -1) consultationCounts[mIndex].value++;
  });

  // 2. Earnings per month (Cumulative)
  let cumulativeEarnings = 0;
  const earningsData = last6Months.map(m => ({ label: m, value: 0 }));
  const sortedCompleted = [...completedBookings].sort((a, b) => new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime());
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0,0,0,0);
  
  sortedCompleted.forEach(b => {
    const d = new Date(b.date || b.createdAt);
    if (d < sixMonthsAgo) {
      cumulativeEarnings += professional.consultationFee;
    }
  });

  last6Months.forEach(mName => {
    sortedCompleted.forEach(b => {
      const d = new Date(b.date || b.createdAt);
      if (monthNames[d.getMonth()] === mName && d >= sixMonthsAgo) {
        cumulativeEarnings += professional.consultationFee;
      }
    });
    const mIndex = earningsData.findIndex(x => x.label === mName);
    if (mIndex !== -1) earningsData[mIndex].value = cumulativeEarnings;
  });

  // 3. Patient breakdown by reason
  const reasonMap: Record<string, number> = {};
  bookings.forEach(b => {
    const reason = b.reason.length > 20 ? b.reason.substring(0, 20) + '...' : (b.reason || 'General');
    reasonMap[reason] = (reasonMap[reason] || 0) + 1;
  });
  
  const colors = ['#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f59e0b', '#ec4899'];
  const reasonDonutData = Object.keys(reasonMap).map((reason, i) => ({
    label: reason,
    value: reasonMap[reason],
    color: colors[i % colors.length]
  }));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/medical')}
                className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold hidden md:inline">Back to Medical Hub</span>
              </button>
              <div className="h-8 w-px bg-gray-300 dark:bg-white/10 hidden md:block" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Medical Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                {pendingBookings.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={professional.image}
              alt={professional.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{professional.name}</h2>
              <p className="text-emerald-50 text-lg mb-4">{professional.role} • {professional.practice}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {professional.specializations.slice(0, 3).map((spec, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span className="text-2xl font-bold">{professional.rating}</span>
                </div>
                <p className="text-emerald-50 text-sm">Rating</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{completedBookings.length}</p>
                <p className="text-emerald-50 text-sm">Consultations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                Pending
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{pendingBookings.length}</p>
            <p className="text-sm text-slate-600 dark:text-gray-400">New Requests</p>
          </div>

          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                Scheduled
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{acceptedBookings.length}</p>
            <p className="text-sm text-slate-600 dark:text-gray-400">Upcoming</p>
          </div>

          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{completedBookings.length}</p>
            <p className="text-sm text-slate-600 dark:text-gray-400">This Month</p>
          </div>

          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                Earnings
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">₦{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-slate-600 dark:text-gray-400">Total Earned</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'requests', label: 'Consultation Requests', icon: Calendar, badge: pendingBookings.length },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'contributions', label: 'Contributions', icon: Lightbulb }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'requests' | 'analytics' | 'contributions')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-[#1a2e22] text-slate-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-500" />
                  Profile Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">License Number</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{professional.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Experience</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{professional.experienceYears} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Consultation Fee</p>
                    <p className="font-semibold text-slate-900 dark:text-white">₦{professional.consultationFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">Location</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{professional.state}, {professional.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="mt-6 w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  About Me
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-6">
                  {professional.about}
                </p>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {professional.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Consultation Requests Tab */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Consultation Requests</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                  {pendingBookings.length} pending request{pendingBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/10">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-gray-400">No consultation requests yet</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{booking.patientName}</h4>
                              <p className="text-sm text-slate-600 dark:text-gray-400">{booking.patientEmail}</p>
                            </div>
                          </div>
                          <div className="ml-15 space-y-1">
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              <span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              <span className="font-semibold">Reason:</span> {booking.reason}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {booking.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'accepted')}
                                className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking.id, 'declined')}
                                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Decline
                              </button>
                            </>
                          ) : (
                            <span
                              className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                                booking.status === 'accepted'
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : booking.status === 'completed'
                                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">Total Patients</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{bookings.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                          <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">Average Rating</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{professional.rating}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">Profile Views</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{professional.sessions || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                    Earnings Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Total Earnings</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">₦{totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Per Consultation</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">₦{professional.consultationFee.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Completed Sessions</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedBookings.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">Consultations per Month</h3>
                  <BarChart 
                    title="Consultations per Month"
                    desc="Bar chart showing number of completed consultations each month"
                    data={consultationCounts}
                    color="#10b981"
                  />
                </div>
                <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">Earnings Over Time</h3>
                  <LineChart 
                    title="Earnings Over Time"
                    desc="Line chart showing cumulative earnings over the last 6 months"
                    labels={earningsData.map(d => d.label)}
                    datasets={[{ label: 'Earnings', data: earningsData.map(d => d.value), color: '#3b82f6' }]}
                    formatValue={(val) => `₦${val.toLocaleString()}`}
                  />
                </div>
                <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">Patient Breakdown</h3>
                  <DonutChart 
                    title="Patient Breakdown by Reason"
                    desc="Donut chart showing the primary reasons patients book consultations"
                    data={reasonDonutData}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contributions Tab */}
          {activeTab === 'contributions' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Health Tips Shared
                </h3>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">0</p>
                  <p className="text-slate-600 dark:text-gray-400 mb-6">Tips shared with the community</p>
                  <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition-colors">
                    Share a Health Tip
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-500" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">New Professional</p>
                      <p className="text-sm text-slate-600 dark:text-gray-400">Joined the platform</p>
                    </div>
                  </div>
                  {completedBookings.length >= 10 && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">10 Consultations</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Milestone achieved!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
