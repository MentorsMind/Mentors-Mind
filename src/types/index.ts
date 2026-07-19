export type { Mentor, MedicalProfessional, Review, Experience, Post as DataPost, ConsultationBooking } from '../data';
export type { User, LearningGoal, NotificationPreferences } from '../contexts/AuthContext';
export type { Session, SessionResource } from '../contexts/BookingContext';
export type { Post as ForumPost, Comment } from '../contexts/ForumContext';
export type { Notification as AppNotification } from '../contexts/NotificationContext';
export type { Message, Thread } from '../contexts/MessageContext';
export type { Transaction, Payout, WalletData } from '../contexts/WalletContext';
export type { ViewHistoryEntry, RecommendedMentor } from '../lib/recommendations';
export type { Mentor as ImportedMentor } from '../data';

import type { Mentor, Review, Experience } from '../data';

export interface AnyMentor extends Mentor {
  specializations?: Array<string | { name: string; price: number }>;
  phone?: string;
  state?: string;
  country?: string;
  tips?: string[];
}
