/**
 * Safe wrapper around localStorage that handles malformed JSON gracefully.
 * If a stored value cannot be parsed, it resets the key to a safe default
 * and logs a warning instead of throwing.
 */

export type StorageValue =
  | string
  | number
  | boolean
  | null
  | object
  | unknown[];

export function safeGetItem<T = StorageValue>(
  key: string,
  fallback: T | null = null,
): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch (error) {
    console.warn(
      `[safeStorage] Corrupted JSON for key "${key}". Resetting to fallback.`,
      error,
    );

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }

    return fallback;
  }
}

export function safeSetItem(key: string, value: StorageValue): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[safeStorage] Failed to set item "${key}":`, error);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[safeStorage] Failed to remove item "${key}":`, error);
  }
}

export function safeGetPosts(): Post[] {
  return safeGetItem<Post[]>("posts", []) || [];
}

export function safeGetSessions(): Session[] {
  return safeGetItem<Session[]>("sessions", []) || [];
}

export interface Post {
  id: string;
  authorId: string;
  author: string;
  authorImage?: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  timestamp: string;
  answers: number;
  comments: Comment[];
  likes: number;
  likedBy: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  mentorId: string;
  learnerId: string;
  mentorName: string;
  learnerName: string;
  mentorImage: string;
  learnerImage: string;
  date: string;
  topic: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  resources?: SessionResource[];
}

export interface SessionResource {
  id: string;
  title: string;
  type: "link" | "note" | "file";
  content: string;
  addedBy: string;
  addedAt: string;
}
