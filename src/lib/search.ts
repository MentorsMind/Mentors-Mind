/**
 * TF-IDF-inspired search utilities for mentors and forum posts.
 * Implements relevance scoring with weighted field matching.
 */

import type { User } from "../contexts/AuthContext";
import type { ForumPost } from "../contexts/ForumContext";

interface SearchResult<T> {
  item: T;
  score: number;
}

/**
 * Calculate term frequency (TF) - how often a term appears in the text
 */
function calculateTF(term: string, text: string): number {
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const regex = new RegExp(`\\b${lowerTerm}\\b`, "g");
  const matches = lowerText.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Search mentors with TF-IDF-inspired relevance scoring
 * Weights: name (3x), role (2x), specializations (2x), company (1x), about (1x)
 */
export function searchMentors(query: string, mentors: User[]): SearchResult<User>[] {
  if (!query.trim()) return [];

  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 0);

  const results: SearchResult<User>[] = mentors
    .map((mentor) => {
      let score = 0;

      // Name field - highest weight (3x)
      const name = mentor.name || "";
      for (const term of terms) {
        const tf = calculateTF(term, name);
        score += tf * 3;
        // Bonus for exact match or starts with
        if (name.toLowerCase().includes(term)) {
          score += 0.5;
        }
      }

      // Role field - medium weight (2x)
      const role = mentor.title || "";
      for (const term of terms) {
        score += calculateTF(term, role) * 2;
      }

      // Specializations - medium weight (2x)
      const specializations = mentor.specializations?.map((s) => s.name).join(" ") || "";
      for (const term of terms) {
        score += calculateTF(term, specializations) * 2;
      }

      // Company - low weight (1x)
      const company = mentor.company || "";
      for (const term of terms) {
        score += calculateTF(term, company) * 1;
      }

      // About - low weight (1x)
      const about = mentor.about || "";
      for (const term of terms) {
        score += calculateTF(term, about) * 1;
      }

      // Category bonus
      const category = mentor.category || "";
      for (const term of terms) {
        if (category.toLowerCase() === term) {
          score += 2;
        }
      }

      return { item: mentor, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Search forum posts with TF-IDF-inspired relevance scoring
 * Weights: title (3x), tags (2x), content (1x)
 */
export function searchPosts(query: string, posts: ForumPost[]): SearchResult<ForumPost>[] {
  if (!query.trim()) return [];

  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 0);

  const results: SearchResult<ForumPost>[] = posts
    .map((post) => {
      let score = 0;

      // Title field - highest weight (3x)
      const title = post.title || "";
      for (const term of terms) {
        const tf = calculateTF(term, title);
        score += tf * 3;
        // Bonus for exact match or starts with
        if (title.toLowerCase().includes(term)) {
          score += 0.5;
        }
      }

      // Tags/Category - medium weight (2x)
      const category = post.category || "";
      for (const term of terms) {
        if (category.toLowerCase().includes(term)) {
          score += 2;
        }
      }

      // Content - low weight (1x)
      const content = post.content || "";
      for (const term of terms) {
        score += calculateTF(term, content) * 1;
      }

      return { item: post, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}
