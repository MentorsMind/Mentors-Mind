import { useState } from 'react';
import { Copy, Check, Users, Gift, Link2, ChevronRight } from 'lucide-react';
import { useReferral } from '../hooks/useReferral';

/**
 * ReferralSection — displayed inside the learner Settings page.
 *
 * Shows:
 *  - The user's unique referral link with a copy-to-clipboard button
 *  - Total number of referred users
 *  - List of referral rewards earned
 */
export function ReferralSection() {
  const { stats } = useReferral();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!stats.referralLink) return;
    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = stats.referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Referral Programme
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share your link, grow the community, and earn rewards when friends
          complete their first mentorship session.
        </p>
      </div>

      {/* Referral Link Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700/40">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Your referral link
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 bg-white dark:bg-black/20 border border-emerald-200 dark:border-emerald-700/40 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate select-all">
              {stats.referralLink || '—'}
            </p>
          </div>

          <button
            onClick={handleCopy}
            disabled={!stats.referralLink}
            aria-label={copied ? 'Copied!' : 'Copy referral link'}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200
              ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40'
              }
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {stats.referralCode && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Your code:{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">
              {stats.referralCode}
            </span>
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.referralCount}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Users referred
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.rewards.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Rewards earned
          </p>
        </div>
      </div>

      {/* Rewards List */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Reward History
          </h3>
        </div>

        {stats.rewards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No rewards yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
              You earn a reward each time a friend you referred completes their
              first booked session.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-white/5">
            {stats.rewards.map((reward, i) => (
              <li
                key={reward.sessionId}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Referral Reward #{i + 1}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Session completed ·{' '}
                    {new Date(reward.rewardedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* How it works */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          How it works
        </h4>
        <ol className="space-y-2">
          {[
            'Share your unique referral link with friends.',
            'They sign up using your link.',
            'When they complete their first mentorship session, you earn a reward.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
