import { createContext, useContext, useState, useEffect, useTransition, useCallback } from 'react';
import { useAuth, type ReferralReward } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { showToast } from '../lib/toast';
import { get, getSync, set, setSync } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

export interface SessionResource {
  id: string;
  title: string;
  type: 'link' | 'note' | 'file';
  content: string; // URL, Markdown text, or Base64 string
  addedBy: string;
  addedAt: string; // ISO String
}

export interface Session {
  id: string;
  mentorId: string;
  learnerId: string;
  mentorName: string;
  learnerName: string;
  mentorImage: string;
  learnerImage: string;
  date: string; // ISO String
  topic: string;
  status: 'optimistic' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  resources?: SessionResource[];
}

interface BookingContextType {
  sessions: Session[];
  bookSession: (mentorId: string, mentorName: string, mentorImage: string, date: Date, topic: string) => Promise<void>;
  updateSessionStatus: (sessionId: string, status: Session['status']) => void;
  getSessionsForUser: (userId: string) => Session[];
  addSessionResource: (sessionId: string, resource: Omit<SessionResource, 'id' | 'addedBy' | 'addedAt'>) => void;
  removeSessionResource: (sessionId: string, resourceId: string) => void;
  rollbackBooking: (sessionId: string, snapshot: Session[]) => void;
  loading: boolean;
  isTransitionPending: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isTransitionPending, startTransition] = useTransition();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      const storedSessions = await get<Session[]>(STORAGE_KEYS.SESSIONS);
      if (storedSessions) {
        setSessions(storedSessions);
      }
      setLoading(false);
    };

    void loadSessions();
  }, []);

  useEffect(() => {
    if (!loading) {
      void set(STORAGE_KEYS.SESSIONS, sessions);
    }
  }, [sessions, loading]);

  const bookSession = async (mentorId: string, mentorName: string, mentorImage: string, date: Date, topic: string) => {
    if (!user) throw new Error("Must be logged in to book a session");

    const newSession: Session = {
      id: crypto.randomUUID(),
      mentorId,
      learnerId: user.id,
      mentorName,
      learnerName: user.name,
      mentorImage,
      learnerImage: user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      date: date.toISOString(),
      topic,
      status: 'optimistic',
    };

    const snapshot: Session[] = [...sessions];

    startTransition(() => {
      setSessions(prev => [newSession, ...prev]);
    });

    addNotification(
      mentorId,
      'booking',
      'New Session Request',
      `${user.name} requested a session on ${topic}`,
      `/mentor-dashboard`,
    );

    await new Promise(resolve => setTimeout(resolve, 500));

    const failureRate = Number(import.meta.env.VITE_BOOKING_FAILURE_RATE) || 0.1;
    const shouldFail = Math.random() < failureRate;

    if (shouldFail) {
      startTransition(() => {
        setSessions(snapshot);
      });
      showToast('Booking failed. Please try again.', 'error');
      return;
    }

    startTransition(() => {
      setSessions(prev =>
        prev.map(s =>
          s.id === newSession.id ? { ...s, status: 'pending' } : s,
        ),
      );
    });
  };

  const rollbackBooking = useCallback((sessionId: string, snapshot: Session[]) => {
    startTransition(() => {
      setSessions(snapshot);
    });
    showToast('Session booking has been rolled back.', 'info');
  }, []);

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    const sessionToUpdate = sessions.find(s => s.id === sessionId);
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));

    if (sessionToUpdate && user) {
      const recipientId = user.id === sessionToUpdate.mentorId ? sessionToUpdate.learnerId : sessionToUpdate.mentorId;
      const senderName = user.name;
      const dashboardLink = user.id === sessionToUpdate.mentorId ? `/learner-dashboard` : `/mentor-dashboard`;

      addNotification(
        recipientId,
        'booking',
        `Session ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Your session with ${senderName} has been ${status}.`,
        dashboardLink
      );

      if (status === 'completed' && sessionToUpdate.learnerId) {
        const allUsers = getSync<(Record<string, unknown> & {
          id: string;
          referredBy?: string;
          referralRewards?: ReferralReward[];
        })[]>(STORAGE_KEYS.USERS) ?? [];

        const learner = allUsers.find((u) => u.id === sessionToUpdate.learnerId);
        const learnerSessions = sessions.filter((s) => s.learnerId === sessionToUpdate.learnerId);
        const completedSessions = learnerSessions.filter((s) => s.status === 'completed');
        const isFirstSession = completedSessions.length === 1;

        if (isFirstSession && learner?.referredBy) {
          const referrerId = learner.referredBy;
          const referrerIndex = allUsers.findIndex((u) => u.id === referrerId);

          if (referrerIndex !== -1) {
            const existingRewards: ReferralReward[] =
              allUsers[referrerIndex].referralRewards ?? [];

            if (!existingRewards.some((r) => r.sessionId === sessionId)) {
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
              setSync(STORAGE_KEYS.USERS, allUsers);

              if (user.id === referrerId) {
                const currentUser = getSync<Record<string, unknown> & {
                  id: string;
                  referralRewards?: ReferralReward[];
                }>(STORAGE_KEYS.CURRENT_USER);
                if (currentUser?.id === referrerId) {
                  currentUser.referralRewards = updatedRewards;
                  setSync(STORAGE_KEYS.CURRENT_USER, currentUser);
                }
              }
            }
          }
        }
      }
    }
  };

  const getSessionsForUser = (userId: string) => {
    return sessions.filter(s => s.mentorId === userId || s.learnerId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addSessionResource = (sessionId: string, resource: Omit<SessionResource, 'id' | 'addedBy' | 'addedAt'>) => {
    if (!user) return;
    const newResource: SessionResource = {
      ...resource,
      id: crypto.randomUUID(),
      addedBy: user.id,
      addedAt: new Date().toISOString()
    };

    let sessionToUpdate: Session | undefined;

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        sessionToUpdate = s;
        return {
          ...s,
          resources: [...(s.resources || []), newResource]
        };
      }
      return s;
    }));

    if (sessionToUpdate && user.id === sessionToUpdate.mentorId) {
      addNotification(
        sessionToUpdate.learnerId,
        'system',
        'New Session Resource',
        `${user.name} added a new ${resource.type} to your session.`,
        '/learner/dashboard'
      );
    }
  };

  const removeSessionResource = (sessionId: string, resourceId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId && s.resources) {
        return {
          ...s,
          resources: s.resources.filter(r => r.id !== resourceId)
        };
      }
      return s;
    }));
  };

  return (
    <BookingContext.Provider value={{ sessions, bookSession, updateSessionStatus, getSessionsForUser, addSessionResource, removeSessionResource, rollbackBooking, loading, isTransitionPending }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
