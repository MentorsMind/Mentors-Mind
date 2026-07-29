import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import type { AvailabilitySlot } from "../contexts/AuthContext";

interface AvailabilityEditorProps {
  availability: AvailabilitySlot[] | undefined;
  timezone: string | undefined;
  onSave: (availability: AvailabilitySlot[], timezone: string) => void;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York", // EST/EDT
  "America/Chicago", // CST/CDT
  "America/Denver", // MST/MDT
  "America/Los_Angeles", // PST/PDT
  "Europe/London", // GMT/BST
  "Europe/Paris", // CET/CEST
  "Europe/Lagos", // WAT
  "Asia/Dubai", // GST
  "Asia/Kolkata", // IST
  "Asia/Bangkok", // ICT
  "Asia/Shanghai", // CST
  "Asia/Tokyo", // JST
  "Australia/Sydney", // AEDT/AEST
];

export function AvailabilityEditor({ availability, timezone: initialTimezone, onSave }: AvailabilityEditorProps) {
  const [grid, setGrid] = useState<Record<number, { start: number; end: number }>>(() => {
    const initial: Record<number, { start: number; end: number }> = {};
    for (let day = 0; day < 7; day++) {
      initial[day] = { start: 9, end: 17 };
    }
    if (availability) {
      for (const slot of availability) {
        initial[slot.dayOfWeek] = { start: slot.startHour, end: slot.endHour };
      }
    }
    return initial;
  });

  const [selectedTimezone, setSelectedTimezone] = useState(initialTimezone || "UTC");
  const [customTimezone, setCustomTimezone] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(
    initialTimezone && !COMMON_TIMEZONES.includes(initialTimezone)
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function toggleHour(day: number, hour: number) {
    setGrid((prev) => {
      const current = prev[day];
      let newStart = current.start;
      let newEnd = current.end;

      // If clicking the start hour
      if (hour === current.start && hour + 1 <= current.end) {
        newStart = hour + 1;
      }
      // If clicking the end hour - 1 (since end is exclusive in UI)
      else if (hour === current.end - 1 && hour > current.start) {
        newEnd = hour;
      }
      // Otherwise, extend or shrink the range
      else if (hour < current.start) {
        newStart = hour;
      } else if (hour >= current.end) {
        newEnd = hour + 1;
      } else {
        // Hour is within range, contract towards closer boundary
        const distToStart = hour - current.start;
        const distToEnd = current.end - hour;
        if (distToStart <= distToEnd) {
          newEnd = hour;
        } else {
          newStart = hour + 1;
        }
      }

      return { ...prev, [day]: { start: newStart, end: newEnd } };
    });
  }

  function handleSave() {
    const slots: AvailabilitySlot[] = [];
    const finalTimezone = showCustomInput ? customTimezone : selectedTimezone;

    for (let day = 0; day < 7; day++) {
      const { start, end } = grid[day];
      if (start < end) {
        slots.push({
          dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          startHour: start,
          endHour: end,
          timezone: finalTimezone,
        });
      }
    }

    onSave(slots, finalTimezone);
  }

  return (
    <div className="space-y-6">
      {/* Timezone selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Globe className="w-4 h-4" />
          Your Timezone
        </label>
        {!showCustomInput ? (
          <div className="flex gap-2">
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            >
              Custom
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customTimezone}
              onChange={(e) => setCustomTimezone(e.target.value)}
              placeholder="e.g., Africa/Lagos"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Weekly grid */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Clock className="w-4 h-4" />
          Weekly Availability
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click hours to toggle availability. Drag or click adjacent hours to set a range.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {DAYS_OF_WEEK.map((day, dayIndex) => {
            const { start, end } = grid[dayIndex];
            const hoursAvailable = end - start;

            return (
              <div key={dayIndex} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-20">
                    {day}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {start}:00 - {end}:00 ({hoursAvailable}h)
                  </span>
                </div>

                {/* Hour grid for this day */}
                <div className="grid grid-cols-12 gap-1">
                  {hours.map((hour) => {
                    const isActive = hour >= start && hour < end;

                    return (
                      <button
                        key={`${dayIndex}-${hour}`}
                        type="button"
                        onClick={() => toggleHour(dayIndex, hour)}
                        title={`${hour}:00 - ${hour + 1}:00`}
                        className={`h-8 rounded text-xs font-medium transition-all ${
                          isActive
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                        }`}
                      >
                        {hour}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
      >
        Save Availability
      </button>
    </div>
  );
}
