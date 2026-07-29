import { useState } from 'react';
import { X, MessageSquare, Loader2 } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { showToast } from '../lib/toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorImage: string;
  mentorRate?: number; // Hourly rate in Naira
}

export function BookingModal({ isOpen, onClose, mentorId, mentorName, mentorImage }: BookingModalProps) {
  const { bookSession, isTransitionPending } = useBooking();
  const [topic, setTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useFocusTrap(isOpen, onClose);

  // Load Paystack SDK when modal opens
  useEffect(() => {
    if (isOpen && !paystackLoaded) {
      loadPaystackScript()
        .then(() => setPaystackLoaded(true))
        .catch((err) => {
          console.error('Failed to load Paystack:', err);
          setError('Payment system unavailable. Please try again later.');
        });
    }
  }, [isOpen, paystackLoaded]);

  if (!isOpen) return null;

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const paystackKey = getPaystackPublicKey();
      const amountInKobo = formatAmountInKobo(mentorRate);

      const response = await initiatePayment({
        key: paystackKey,
        email: user.email,
        amount: amountInKobo,
        firstname: user.name?.split(' ')[0],
        lastname: user.name?.split(' ')[1] || '',
        phone: user.phone,
        metadata: {
          mentorId,
          mentorName,
          topic,
          userId: user.id
        },
        onClose: () => {
          setLoading(false);
          setError('Payment was cancelled');
          setStep('topic');
        }
      });

      // Payment successful - create booking and transaction
      const placeholderDate = new Date();
      // bookSession now optimistically adds the session and resolves asynchronously
      await bookSession(mentorId, mentorName, mentorImage, placeholderDate, topic);
      // Session appears instantly in the UI with "optimistic" status
      // On success, status resolves to "pending" (background transition)
      // On failure, session is rolled back with a toast
      setTopic('');
      onClose();
    } catch (error) {
      // Error case (e.g. not logged in) — show toast instead of alert
      const message = error instanceof Error ? error.message : 'Booking request failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" aria-modal="true" role="dialog">
      <div ref={modalRef} className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
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

          {/* Payment Details */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

          <div>
            <label htmlFor="topic-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                What would you like to discuss?
              </div>
            </label>
            <textarea
              id="topic-input"
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
        </div>
      </div>
    );
  }

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Request'}
          </button>
        </form>
      </div>
    );
  }

  return null;
}

