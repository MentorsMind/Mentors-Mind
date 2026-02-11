import React, { useState } from 'react';
import { X, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorImage: string;
}

export function BookingModal({ isOpen, onClose, mentorId, mentorName, mentorImage }: BookingModalProps) {
  const { bookSession } = useBooking();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use a placeholder date - mentor will schedule the actual time
      const placeholderDate = new Date();
      await bookSession(mentorId, mentorName, mentorImage, placeholderDate, topic);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTopic(''); // Reset form
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Booking request failed', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-[#1a2e22] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {mentorName} will review your request and schedule a session time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Mentorship</h2>
          <div className="flex items-center gap-3 mt-4">
            <img src={mentorImage} alt={mentorName} className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Request session with</p>
              <p className="font-bold text-gray-900 dark:text-white">{mentorName}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> {mentorName} will review your request and schedule a convenient time for both of you.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  What would you like to discuss?
                </div>
            </label>
            <textarea 
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe what you'd like help with, your goals, or any specific questions you have..."
              rows={5}
              className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none dark:text-white"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Be as detailed as possible to help {mentorName.split(' ')[0]} prepare for your session.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
