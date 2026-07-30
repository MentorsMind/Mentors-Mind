import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import type { Session } from '../contexts/BookingContext';
import type { AvailabilitySlot } from '../contexts/AuthContext';

// 30-minute slots from 08:00 to 20:00
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let hour = 8; hour < 20; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
})();

interface CalendarProps {
  /** Sessions already booked for this mentor (from BookingContext) */
  bookedSessions: Session[];
  /** Called when the user picks a confirmed date+time */
  onSelect: (date: Date) => void;
  /** Currently selected date (controlled) */
  selectedDate: Date | null;
  /** Optional: mentor's availability slots for filtering */
  mentorAvailability?: AvailabilitySlot[];
  /** Optional: mentor's timezone for display */
  mentorTimezone?: string;
  /** Optional: learner's timezone for conversion */
  learnerTimezone?: string;
}

/**
 * Returns the ISO date string "YYYY-MM-DD" for a given Date (local time).
 */
function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Returns minutes since midnight for a given ISO datetime string.
 */
function minutesSinceMidnight(isoString: string): number {
  const d = new Date(isoString);
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * Build a set of blocked time-slot strings ("HH:MM") for a given day key,
 * based on sessions whose status is 'pending', 'confirmed', or 'optimistic'.
 */
function buildBlockedSlots(
  bookedSessions: Session[],
  dateKey: string,
): Set<string> {
  const blocked = new Set<string>();

  for (const session of bookedSessions) {
    const sessionKey = toDateKey(new Date(session.date));
    if (sessionKey !== dateKey) continue;
    if (!['pending', 'confirmed', 'optimistic'].includes(session.status)) continue;

    const sessionStart = minutesSinceMidnight(session.date);
    // Block the session's own 30-min slot plus the adjacent slot to prevent
    // back-to-back overlap on the same half-hour boundary.
    const sessionEnd = sessionStart + 30;

    for (const slot of TIME_SLOTS) {
      const [h, m] = slot.split(':').map(Number);
      const slotStart = h * 60 + m;
      const slotEnd = slotStart + 30;

      // Overlap check: two intervals overlap when start < other.end && end > other.start
      if (slotStart < sessionEnd && slotEnd > sessionStart) {
        blocked.add(slot);
      }
    }
  }

  return blocked;
}

/**
 * Check if a time slot is within mentor's available hours for a given day
 */
function isSlotAvailable(
  slot: string,
  dayOfWeek: number,
  availability?: AvailabilitySlot[],
): boolean {
  if (!availability || availability.length === 0) return true;

  const daySlots = availability.filter((a) => a.dayOfWeek === dayOfWeek);
  if (daySlots.length === 0) return false;

  const [h, m] = slot.split(':').map(Number);
  const hour = h + m / 60;

  return daySlots.some((slot) => hour >= slot.startHour && hour < slot.endHour);
}

export function Calendar({ 
  bookedSessions, 
  onSelect, 
  selectedDate,
  mentorAvailability,
  mentorTimezone,
  learnerTimezone,
}: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [pickedDay, setPickedDay] = useState<Date | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);

  // Check if mentor has no availability set
  const mentorHasNoAvailability = mentorAvailability && mentorAvailability.length === 0;

  // ── Calendar grid helpers ────────────────────────────────────────────────

  const firstDayOfMonth = useMemo(
    () => new Date(viewYear, viewMonth, 1).getDay(), // 0 = Sunday
    [viewYear, viewMonth],
  );

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth],
  );

  const monthLabel = useMemo(
    () =>
      new Date(viewYear, viewMonth, 1).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    [viewYear, viewMonth],
  );

  // Days that have at least one booking (for dot indicators)
  const daysWithBookings = useMemo(() => {
    const days = new Set<string>();
    for (const s of bookedSessions) {
      if (['pending', 'confirmed', 'optimistic'].includes(s.status)) {
        days.add(toDateKey(new Date(s.date)));
      }
    }
    return days;
  }, [bookedSessions]);

  // ── Navigation ───────────────────────────────────────────────────────────

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setPickedDay(null);
    setPickedTime(null);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setPickedDay(null);
    setPickedTime(null);
  }

  // ── Interaction ──────────────────────────────────────────────────────────

  function handleDayClick(day: number) {
    const clicked = new Date(viewYear, viewMonth, day);
    clicked.setHours(0, 0, 0, 0);
    if (clicked < today) return; // past day — no-op
    setPickedDay(clicked);
    setPickedTime(null);
  }

  function handleTimeClick(slot: string, blocked: boolean) {
    if (blocked || !pickedDay) return;
    setPickedTime(slot);

    const [h, m] = slot.split(':').map(Number);
    const result = new Date(pickedDay);
    result.setHours(h, m, 0, 0);
    onSelect(result);
  }

  // ── Derived state for time-slot panel ────────────────────────────────────

  const blockedSlots = useMemo(() => {
    if (!pickedDay) return new Set<string>();
    const booked = buildBlockedSlots(bookedSessions, toDateKey(pickedDay));
    
    // Also block slots outside mentor's availability
    if (mentorAvailability && mentorAvailability.length > 0) {
      const unavailableSlots = new Set<string>();
      for (const slot of TIME_SLOTS) {
        if (!isSlotAvailable(slot, pickedDay.getDay(), mentorAvailability)) {
          unavailableSlots.add(slot);
        }
      }
      // Merge booked and unavailable slots
      return new Set([...booked, ...unavailableSlots]);
    }
    
    return booked;
  }, [bookedSessions, pickedDay, mentorAvailability]);

  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null;
  const selectedTimeSlot = selectedDate
    ? `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`
    : null;

  // ── Render ───────────────────────────────────────────────────────────────

  if (mentorHasNoAvailability) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30">
        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <div className="text-center">
          <h3 className="font-semibold text-amber-900 dark:text-amber-200">Mentor availability not set</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            This mentor hasn't set their availability yet. Please contact them to schedule a session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5" role="group" aria-label="Session date and time picker">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-gray-900 dark:text-white select-none">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div
        className="grid grid-cols-7 text-center"
        role="row"
        aria-label="Days of the week"
      >
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span
            key={d}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 py-1"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7 gap-y-1"
        role="grid"
        aria-label={`Calendar for ${monthLabel}`}
      >
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} aria-hidden="true" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayDate = new Date(viewYear, viewMonth, day);
          dayDate.setHours(0, 0, 0, 0);
          const isPast = dayDate < today;
          const isToday = toDateKey(dayDate) === toDateKey(today);
          const isPicked =
            pickedDay !== null && toDateKey(dayDate) === toDateKey(pickedDay);
          const isSelected =
            selectedDateKey !== null &&
            toDateKey(dayDate) === selectedDateKey;
          const hasBooking = daysWithBookings.has(toDateKey(dayDate));

          let cellClass =
            'relative mx-auto flex flex-col items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-colors select-none ';

          if (isPast) {
            cellClass += 'text-gray-300 dark:text-gray-700 cursor-not-allowed';
          } else if (isSelected || isPicked) {
            cellClass +=
              'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 cursor-pointer';
          } else if (isToday) {
            cellClass +=
              'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20';
          } else {
            cellClass +=
              'text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10';
          }

          return (
            <div key={day} className="flex items-center justify-center" role="gridcell">
              <button
                type="button"
                disabled={isPast}
                aria-label={`${dayDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}${hasBooking ? ', has bookings' : ''}`}
                aria-pressed={isPicked || isSelected}
                onClick={() => handleDayClick(day)}
                className={cellClass}
              >
                {day}
                {/* Booking dot indicator */}
                {hasBooking && !isPast && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Time slot panel — shows when a day is picked */}
      {pickedDay && (
        <div className="mt-1">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Available times ·{' '}
              {pickedDay.toLocaleDateString('default', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div
            className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10"
            role="listbox"
            aria-label="Available time slots"
          >
            {TIME_SLOTS.map((slot) => {
              const isBlocked = blockedSlots.has(slot);
              const isActive = pickedTime === slot || selectedTimeSlot === slot;

              let slotClass =
                'py-2 px-1 rounded-xl text-xs font-semibold border transition-colors text-center ';

              if (isBlocked) {
                slotClass +=
                  'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 border-gray-100 dark:border-white/5 cursor-not-allowed line-through';
              } else if (isActive) {
                slotClass +=
                  'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 cursor-pointer';
              } else {
                slotClass +=
                  'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 cursor-pointer';
              }

              return (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={isBlocked}
                  disabled={isBlocked}
                  onClick={() => handleTimeClick(slot, isBlocked)}
                  className={slotClass}
                  title={isBlocked ? 'This slot is already booked' : slot}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {blockedSlots.size > 0 && (
            <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded bg-gray-300 dark:bg-gray-600" />
              Strikethrough slots are already booked or unavailable
            </p>
          )}
        </div>
      )}

      {/* Selection summary */}
      {selectedDate && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {selectedDate.toLocaleString('default', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
