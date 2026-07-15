import { User } from '../contexts/AuthContext';

export interface ViewHistoryEntry {
  mentorId: string;
  viewedAt: string;
}

export interface RecommendedMentor extends any {
  recommendationScore: number;
  isRecommended: boolean;
}

export function recommendMentors(
  user: User | null,
  allMentors: any[],
  sessions: any[],
  viewHistory: ViewHistoryEntry[]
): RecommendedMentor[] {
  // 1. Identify past booking patterns
  const bookedMentorIds = new Set(sessions.map((s) => s.mentorId));
  
  const bookedCategories = new Set<string>();
  const bookedTags = new Set<string>();
  
  sessions.forEach((session) => {
    const mentor = allMentors.find((m) => m.id === session.mentorId);
    if (mentor) {
      if (mentor.category) bookedCategories.add(mentor.category);
      if (mentor.tags) {
        mentor.tags.forEach((tag: string) => bookedTags.add(tag));
      }
    }
  });

  // Include views in interests if no bookings exist
  viewHistory.forEach((view) => {
    const mentor = allMentors.find((m) => m.id === view.mentorId);
    if (mentor) {
      if (mentor.category) bookedCategories.add(mentor.category);
      if (mentor.tags) {
        mentor.tags.forEach((tag: string) => bookedTags.add(tag));
      }
    }
  });

  const isColdStart = bookedMentorIds.size === 0 && viewHistory.length === 0;

  // 2. Score mentors
  const scoredMentors = allMentors.map((mentor) => {
    let score = 0;
    
    if (isColdStart) {
      // Cold start: prioritize rating and user's own category
      score += mentor.rating || 0;
      if (user?.category && mentor.category === user.category) {
        score += 10;
      }
    } else {
      // Category match (3x)
      if (bookedCategories.has(mentor.category)) {
        score += 3;
      }
      
      // Tags overlap (2x per tag)
      if (mentor.tags) {
        const overlap = mentor.tags.filter((tag: string) => bookedTags.has(tag)).length;
        score += overlap * 2;
      }
      
      // Rating (1x)
      score += mentor.rating || 0;
      
      // Recently active proxy (1x) -> sessions > 0
      if (mentor.sessions > 0) {
        score += 1;
      }
    }

    return {
      ...mentor,
      recommendationScore: score,
      // If it's not a cold start and they score high, mark as recommended
      isRecommended: !isColdStart && !bookedMentorIds.has(mentor.id) && score >= 5
    };
  });

  // 3. Sort:
  // First, unbooked mentors
  // Then, by score descending
  scoredMentors.sort((a, b) => {
    const aBooked = bookedMentorIds.has(a.id);
    const bBooked = bookedMentorIds.has(b.id);
    
    if (aBooked && !bBooked) return 1;
    if (!aBooked && bBooked) return -1;
    
    return b.recommendationScore - a.recommendationScore;
  });

  return scoredMentors;
}
