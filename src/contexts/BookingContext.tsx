import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, type ReferralReward } from './AuthContext';

import { useNotifications } from './NotificationContext';

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  resources?: SessionResource[];
  amount?: number; // Amount paid in Naira
  paystackReference?: string; // Paystack transaction reference
}

interface BookingContextType {
  sessions: Session[];
  bookSession: (mentorId: string, mentorName: string, mentorImage: string, date: Date, topic: string, amount?: number, paystackReference?: string) => Promise<void>;
  updateSessionStatus: (sessionId: string, status: Session['status']) => void;
  getSessionsForUser: (userId: string) => Session[];
  addSessionResource: (sessionId: string, resource: Omit<SessionResource, 'id' | 'addedBy' | 'addedAt'>) => void;
  removeSessionResource: (sessionId: string, resourceId: string) => void;
  loading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
    setLoading(false);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('sessions', JSON.stringify(sessions));
    }
  }, [sessions, loading]);

  const bookSession = async (mentorId: string, mentorName: string, mentorImage: string, date: Date, topic: string, amount?: number, paystackReference?: string) => {
    if (!user) throw new Error("Must be logged in to book a session");

    const newSession: Session = {
      id: crypto.randomUUID(),
      mentorId,
      learnerId: user.id,
      mentorName,
      learnerName: user.name,
      mentorImage: mentorImage,
      learnerImage: user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      date: date.toISOString(),
      topic,
      status: 'pending',
      amount,
      paystackReference
    };

    setSessions(prev => [newSession, ...prev]);
    
    // Notify Mentor
    addNotification(
      mentorId, 
      'booking', 
      'New Session Request', 
      `${user.name} requested a session on ${topic}`,
      `/mentor-dashboard`
    );

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    const sessionToUpdate = sessions.find(s => s.id === sessionId);
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));

    if (sessionToUpdate && user) {
        // Notify the OTHER party
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

        // Referral reward logic: if status is 'completed' and this is the learner's first session
        if (status === 'completed' && sessionToUpdate.learnerId) {
            const allUsers: (Record<string, unknown> & {
                id: string;
                referredBy?: string;
                referralRewards?: ReferralReward[];
            })[] = JSON.parse(localStorage.getItem('users') || '[]');

            const learner = allUsers.find((u) => u.id === sessionToUpdate.learnerId);
            const learnerSessions = sessions.filter((s) => s.learnerId === sessionToUpdate.learnerId);

            // Check if this is their first completed session
            const completedSessions = learnerSessions.filter((s) => s.status === 'completed');
            const isFirstSession = completedSessions.length === 1; // Just became 1

            if (isFirstSession && learner?.referredBy) {
                const referrerId = learner.referredBy;
                const referrerIndex = allUsers.findIndex((u) => u.id === referrerId);

                if (referrerIndex !== -1) {
                    const existingRewards: ReferralReward[] =
                        allUsers[referrerIndex].referralRewards ?? [];

                    // Idempotency: don't double-credit for the same session
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
                        localStorage.setItem('users', JSON.stringify(allUsers));

                        // If referrer is currently logged in, sync context
                        if (user.id === referrerId) {
                            // Trigger a context update (requires updateUser from AuthContext)
                            // Since we don't have direct access to updateUser here, we just update localStorage
                            // The user will see the reward on next page load or Settings navigation
                            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                            if (currentUser.id === referrerId) {
                                currentUser.referralRewards = updatedRewards;
                                localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
          '/learner/dashboard' // Learner dashboard
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
    <BookingContext.Provider value={{ sessions, bookSession, updateSessionStatus, getSessionsForUser, addSessionResource, removeSessionResource, loading }}>
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
