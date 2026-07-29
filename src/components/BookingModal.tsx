import { useState, useEffect } from 'react';
import { X, MessageSquare, CalendarDays, ChevronLeft, Loader2 } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { showToast } from '../lib/toast';
import {
  loadPaystackScript,
  initiatePayment,
  getPaystackPublicKey,
  formatAmountInKobo,
} from '../lib/paystack';
import { Calendar } from './Calendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorImage: string;
  mentorRate?: number; // Hourly rate in Naira
}

type Step = 'topic' | 'schedule';

export function BookingModal({
  isOpen,
  onClose,
  mentorId,
  mentorName,
  mentorImage,
  mentorRate = 0,
}: BookingModalProps) {
  const { bookSession, sessions } = useBooking();
  const { user } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [topicError, setTopicError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduleError, setScheduleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const modalRef = useFocusTrap(isOpen, onClose);

  // Sessions already booked with this mentor (for conflict detection)
  const mentorSessions = sessions.filter((s) => s.mentorId === mentorId);

  // ── Load Paystack SDK when modal opens ───────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (paystackLoaded) return;

    loadPaystackScript()
      .then(() => setPaystackLoaded(true))
      .catch((err: unknown) => {
        console.error('Failed to load Paystack:', err);
        setError('Payment system unavailable. Please try again later.');
      });
  }, [isOpen, paystackLoaded]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('topic');
      setTopic('');
      setTopicError('');
      setSelectedDate(null);
      setScheduleError('');
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Step 1: topic validation + proceed ───────────────────────────────────
  function handleTopicNext(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setTopicError("Please describe what you'd like to discuss.");
      return;
    }
    if (trimmed.length < 10) {
      setTopicError('Please add a bit more detail (at least 10 characters).');
      return;
    }
    setTopicError('');
    setStep('schedule');
  }

  // ── Step 2: booking submission ───────────────────────────────────────────
  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedDate) {
      setScheduleError('Please select a date and time for your session.');
      return;
    }
    if (!user) {
      showToast('You must be logged in to book a session.', 'error');
      return;
    }

    setScheduleError('');
    setLoading(true);
    setError('');

    const topicValue = topic.trim();
    const dateValue = selectedDate;

    try {
      // If a rate is configured, run through Paystack first
      if (mentorRate > 0) {
        const paystackKey = getPaystackPublicKey();
        const amountInKobo = formatAmountInKobo(mentorRate);

        const reference = await initiatePayment({
          key: paystackKey,
          email: user.email,
          amount: amountInKobo,
          firstname: user.name?.split(' ')[0],
          lastname: user.name?.split(' ')[1] ?? '',
          phone: user.phone,
          metadata: {
            mentorId,
            mentorName,
            topic: topicValue,
            userId: user.id,
            scheduledDate: dateValue.toISOString(),
          },
          onClose: () => {
            setLoading(false);
            setError('Payment was cancelled.');
          },
        });

        onClose();
        await bookSession(
          mentorId,
          mentorName,
          mentorImage,
          dateValue,
          topicValue,
          mentorRate,
          reference,
        );
      } else {
        // Free session — book directly
        onClose();
        await bookSession(mentorId, mentorName, mentorImage, dateValue, topicValue);
      }

      showToast(
        `Session with ${mentorName} requested for ${dateValue.toLocaleString('default', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        'success',
      );
    } catch (err: unknown) {
      setLoading(false);
      const message =
        err instanceof Error ? err.message : 'Booking failed. Please try again.';
      // "Payment cancelled" is not an error worth shouting about
      if (!message.toLowerCase().includes('cancel')) {
        setError(message);
        showToast(message, 'error');
      }
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      aria-modal="true"
      role="dialog"
      aria-labelledby="booking-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-[90vh]"
      >
        {/* ── Header ── */}
        <div className="relative p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2
            id="booking-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Request Mentorship
          </h2>

          <div className="flex items-center gap-3 mt-4">
            <img
              src={mentorImage}
              alt={mentorName}
              className="w-10 h-10 rounded-full bg-gray-200 object-cover"
            />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Session with</p>
              <p className="font-bold text-gray-900 dark:text-white">{mentorName}</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-4" aria-label="Progress steps">
            <StepDot
              number={1}
              label="Topic"
              active={step === 'topic'}
              done={step === 'schedule'}
            />
            <div
              className={`flex-1 h-0.5 rounded-full transition-colors ${
                step === 'schedule'
                  ? 'bg-emerald-500'
                  : 'bg-gray-200 dark:bg-white/10'
              }`}
              aria-hidden="true"
            />
            <StepDot
              number={2}
              label="Schedule"
              active={step === 'schedule'}
              done={false}
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1">
          {error && (
            <div className="mx-6 mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Step 1 — Topic */}
          {step === 'topic' && (
            <form onSubmit={handleTopicNext} noValidate id="topic-form">
              <div className="p-6 space-y-5">
                <div>
                  <label
                    htmlFor="topic-input"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      What would you like to discuss?
                    </div>
                  </label>
                  <textarea
                    id="topic-input"
                    name="topic"
                    required
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      if (topicError) setTopicError('');
                    }}
                    aria-describedby={topicError ? 'topic-error' : undefined}
                    aria-invalid={!!topicError}
                    placeholder="Describe what you'd like help with, your goals, or specific questions you have..."
                    rows={5}
                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none dark:text-white text-sm transition-colors"
                  />
                  {topicError && (
                    <p
                      id="topic-error"
                      role="alert"
                      className="text-red-500 text-xs mt-1.5"
                    >
                      {topicError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Be specific — it helps {mentorName.split(' ')[0]} prepare.
                  </p>
                </div>
              </div>
            </form>
          )}

          {/* Step 2 — Schedule */}
          {step === 'schedule' && (
            <form onSubmit={handleBookingSubmit} noValidate id="schedule-form">
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pick a date &amp; time
                  </span>
                </div>

                <Calendar
                  bookedSessions={mentorSessions}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (scheduleError) setScheduleError('');
                  }}
                  selectedDate={selectedDate}
                />

                {scheduleError && (
                  <p role="alert" className="text-red-500 text-xs">
                    {scheduleError}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* ── Footer / CTA ── */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] shrink-0 flex gap-3">
          {step === 'schedule' && (
            <button
              type="button"
              onClick={() => setStep('topic')}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Back to topic step"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step === 'topic' && (
            <button
              type="submit"
              form="topic-form"
              className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              Next: Choose Time
              <CalendarDays className="w-4 h-4" />
            </button>
          )}

          {step === 'schedule' && (
            <button
              type="submit"
              form="schedule-form"
              disabled={!selectedDate || loading}
              className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  {mentorRate > 0
                    ? `Pay ₦${mentorRate.toLocaleString()} & Book`
                    : 'Confirm Booking'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: step indicator dot ────────────────────────────────────────

interface StepDotProps {
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}

function StepDot({ number, label, active, done }: StepDotProps) {
  return (
    <div className="flex items-center gap-1.5" aria-current={active ? 'step' : undefined}>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          done
            ? 'bg-emerald-500 text-white'
            : active
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-800'
              : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500'
        }`}
      >
        {done ? '✓' : number}
      </div>
      <span
        className={`text-xs font-semibold transition-colors ${
          active
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
