import { useCallback } from 'react';
import { useAuth, type ReferralReward } from '../contexts/AuthContext';

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  rewards: ReferralReward[];
}

/**
 * Hook that provides referral-related data and actions for the current user.
 */
export function useReferral() {
  const { user, updateUser } = useAuth();

  const referralCode = user?.referralCode ?? '';
  const referralLink = referralCode
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : '';

  /**
   * Returns the number of users who signed up using this user's referral code.
   * Reads from localStorage in real-time so the count stays reactive when the
   * component re-renders.
   */
  const getReferralCount = useCallback((): number => {
    if (!user?.id) return 0;
    const allUsers: { referredBy?: string }[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );
    return allUsers.filter((u) => u.referredBy === user.id).length;
  }, [user?.id]);

  /**
   * Called after a referred user's first session is marked as completed.
   * Adds a ReferralReward entry to the referrer's account.
   *
   * @param referrerId   - ID of the user who gets the reward
   * @param sessionId    - ID of the completed session that triggered the reward
   */
  const creditReferralReward = useCallback(
    async (referrerId: string, sessionId: string) => {
      const allUsers: (Record<string, unknown> & {
        id: string;
        referralRewards?: ReferralReward[];
      })[] = JSON.parse(localStorage.getItem('users') || '[]');

      const referrerIndex = allUsers.findIndex((u) => u.id === referrerId);
      if (referrerIndex === -1) return;

      const existingRewards: ReferralReward[] =
        allUsers[referrerIndex].referralRewards ?? [];

      // Idempotency: don't double-credit for the same session
      if (existingRewards.some((r) => r.sessionId === sessionId)) return;

      const newReward: ReferralReward = {
        userId: referrerId,
        sessionId,
        rewardedAt: new Date().toISOString(),
      };

      const updatedRewards = [...existingRewards, newReward];
      allUsers[referrerIndex] = {
        ...allUsers[referrerIndex],
        referralRewards: updatedRewards,
      };
      localStorage.setItem('users', JSON.stringify(allUsers));

      // If the referrer is the currently logged-in user, keep context in sync
      if (user?.id === referrerId) {
        await updateUser({ referralRewards: updatedRewards });
      }
    },
    [user?.id, updateUser]
  );

  const stats: ReferralStats = {
    referralCode,
    referralLink,
    referralCount: getReferralCount(),
    rewards: user?.referralRewards ?? [],
  };

  return { stats, creditReferralReward };
}
