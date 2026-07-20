import { useState, useEffect } from 'react';
import { X, MessageSquare, Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { loadPaystackScript, initiatePayment, getPaystackPublicKey, formatAmountInKobo } from '../lib/paystack';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorImage: string;
  mentorRate?: number; // Hourly rate in Naira
}

type ModalStep = 'topic' | 'payment' | 'success' | 'error';

export function BookingModal({ 
  isOpen, 
  onClose, 
  mentorId, 
  mentorName, 
  mentorImage,
  mentorRate = 50000 // Default rate if not provided
}: BookingModalProps) {
  const { bookSession } = useBooking();
  const { user } = useAuth();
  const { createTransaction } = useWallet();
  const [step, setStep] = useState<ModalStep>('topic');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  
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
    if (!topic.trim()) return;
    
    // Move to payment step
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    if (!paystackLoaded) {
      setError('Payment system is loading. Please wait and try again.');
      return;
    }

    setLoading(true);
    setError('');

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
      
      // Book the session with payment details
      await bookSession(
        mentorId,
        mentorName,
        mentorImage,
        placeholderDate,
        topic,
        mentorRate,
        response
      );

      // Create transaction record for mentor wallet
      const mentorEarnings = mentorRate * 0.8; // 80% to mentor
      const platformFee = mentorRate * 0.2;    // 20% platform fee

      await createTransaction({
        reference: response,
        learnerId: user.id,
        learnerName: user.name,
        learnerImage: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        mentorId,
        totalAmount: mentorRate,
        platformFee,
        mentorEarnings,
        status: 'successful',
        date: new Date().toISOString(),
        metadata: {
          topic,
          learnerEmail: user.email
        }
      });

      setStep('success');
      setTimeout(() => {
        setTopic('');
        setStep('topic');
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setStep('topic');
    } finally {
      setLoading(false);
    }
  };

  // Topic submission step
  if (step === 'topic') {
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
          </div>

          {/* Form */}
          <form onSubmit={handleTopicSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Rate:</strong> ₦{mentorRate.toLocaleString()} per session
              </p>
            </div>

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

            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Payment'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Payment step
  if (step === 'payment') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" aria-modal="true" role="dialog">
        <div ref={modalRef} className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
            <button 
              onClick={() => setStep('topic')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Go back"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Payment</h2>
          </div>

          {/* Payment Details */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                <img src={mentorImage} alt={mentorName} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mentor</p>
                  <p className="font-bold text-gray-900 dark:text-white">{mentorName}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Session Fee:</span>
                  <span className="font-bold text-gray-900 dark:text-white">₦{mentorRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Mentor gets (80%):</span>
                  <span>₦{(mentorRate * 0.8).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Platform fee (20%):</span>
                  <span>₦{(mentorRate * 0.2).toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-500/30 pt-2 mt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span>₦{mentorRate.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Topic: <strong>{topic}</strong>
              </p>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading || !paystackLoaded}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₦{mentorRate.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              You'll be redirected to Paystack to complete the payment securely.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success step
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" aria-modal="true" role="dialog">
        <div className="bg-white dark:bg-[#1a2e22] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your session with {mentorName} has been booked. They will review your request and schedule a time.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
