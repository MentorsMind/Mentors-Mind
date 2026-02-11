import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Stethoscope,
  Filter
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import type { ConsultationBooking } from './data';

export function PatientConsultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'declined'>('all');
  const [patientEmail, setPatientEmail] = useState('');

  useEffect(() => {
    // Get current user's email (you might want to get this from auth context)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.email) {
      setPatientEmail(currentUser.email);
    }

    // Load all consultations
    const allBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
    
    // Filter by patient email if available
    const userConsultations = currentUser?.email 
      ? allBookings.filter((b: ConsultationBooking) => b.patientEmail === currentUser.email)
      : allBookings;
    
    setConsultations(userConsultations);
  }, []);

  const filteredConsultations = consultations.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleCancelConsultation = (id: string) => {
    if (!confirm('Are you sure you want to cancel this consultation request?')) return;

    const allBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
    const updatedBookings = allBookings.map((b: ConsultationBooking) =>
      b.id === id ? { ...b, status: 'declined' as const, cancelledBy: 'patient' } : b
    );
    localStorage.setItem('consultationBookings', JSON.stringify(updatedBookings));
    
    setConsultations(consultations.map(c => 
      c.id === id ? { ...c, status: 'declined' as const } : c
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
      case 'accepted': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'completed': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30';
      case 'declined': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const statusCounts = {
    all: consultations.length,
    pending: consultations.filter(c => c.status === 'pending').length,
    accepted: consultations.filter(c => c.status === 'accepted').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    declined: consultations.filter(c => c.status === 'declined').length,
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/learner-dashboard')}
            className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Consultations</h1>
              <p className="text-slate-600 dark:text-gray-400">Track your medical appointments and consultation history</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'All', count: statusCounts.all },
            { id: 'pending', label: 'Pending', count: statusCounts.pending },
            { id: 'accepted', label: 'Scheduled', count: statusCounts.accepted },
            { id: 'completed', label: 'Completed', count: statusCounts.completed },
            { id: 'declined', label: 'Cancelled', count: statusCounts.declined },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-[#1a2e22] text-slate-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <Filter className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === tab.id
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-white/10'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Consultations List */}
        {filteredConsultations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No {filter !== 'all' ? filter : ''} consultations
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't booked any consultations yet."
                : `You don't have any ${filter} consultations.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/medical')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 transition-all"
              >
                Browse Medical Specialists
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Dr. {consultation.doctorName}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-gray-400">Medical Specialist</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                        </span>
                      </div>

                      {/* Appointment Details */}
                      <div className="grid md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{new Date(consultation.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{consultation.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{consultation.patientPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate">{consultation.patientEmail}</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-slate-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">Reason for Consultation:</p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">{consultation.reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Booked Date */}
                      <p className="text-xs text-slate-500 dark:text-gray-500 mt-3">
                        Booked on {new Date(consultation.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 md:w-40">
                    <button
                      onClick={() => navigate(`/medical-profile/${consultation.doctorId}`)}
                      className="flex-1 md:w-full px-4 py-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                    
                    {consultation.status === 'pending' && (
                      <button
                        onClick={() => handleCancelConsultation(consultation.id)}
                        className="flex-1 md:w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    )}

                    {(consultation.status === 'accepted' || consultation.status === 'completed') && (
                      <button
                        className="flex-1 md:w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
