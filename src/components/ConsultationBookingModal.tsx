import { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Clock, FileText, DollarSign, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { ConsultationBooking } from '../data';
import { useNotifications } from '../contexts/NotificationContext';

interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  consultationFee: number;
  specializations: string[];
}

export function ConsultationBookingModal({ 
  isOpen, 
  onClose, 
  doctorId, 
  doctorName, 
  doctorImage,
  consultationFee,
  specializations
}: ConsultationBookingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create consultation booking
      const newBooking: ConsultationBooking = {
        id: `consultation-${Date.now()}`,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        doctorId: doctorId,
        doctorName: doctorName,
        date: formData.preferredDate,
        time: formData.preferredTime,
        reason: formData.reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
      
      // Add new booking
      const updatedBookings = [newBooking, ...existingBookings];
      localStorage.setItem('consultationBookings', JSON.stringify(updatedBookings));

      // Send notification to doctor
      addNotification(
        doctorId,
        'consultation',
        'New Consultation Request',
        `${formData.patientName} requested a consultation for ${new Date(formData.preferredDate).toLocaleDateString()}`,
        '/medical-dashboard'
      );

      // Show success
      setSuccess(true);
      
      // Reset form and close after delay
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          patientName: '',
          patientEmail: '',
          patientPhone: '',
          preferredDate: '',
          preferredTime: '',
          reason: '',
          additionalNotes: ''
        });
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to book consultation. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-[#1a2e22] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl scale-100 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Consultation Request Sent!</h3>
          <p className="text-slate-600 dark:text-gray-400 mb-6">
            Dr. {doctorName} will review your request and contact you shortly to confirm the appointment.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Next Steps:</strong> You'll receive a confirmation via email or phone within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-2xl shadow-2xl my-8 animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Book Medical Consultation</h2>
          
          <div className="flex items-center gap-4">
            <img src={doctorImage} alt={doctorName} className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-white/10" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg">Dr. {doctorName}</p>
              <p className="text-sm text-slate-600 dark:text-gray-400">{specializations.join(', ')}</p>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₦{consultationFee.toLocaleString()}</span>
                <span className="text-xs text-slate-500 dark:text-gray-500">consultation fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Dr. {doctorName} will review your request and confirm the final appointment time based on availability.
            </p>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Patient Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Preferred Appointment Time
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Preferred Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Consultation Details
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Reason for Consultation *
              </label>
              <textarea
                required
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Please describe your symptoms, concerns, or reason for seeking consultation..."
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                Be as detailed as possible to help the doctor prepare for your consultation.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Any allergies, current medications, or other relevant information..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Consultation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
