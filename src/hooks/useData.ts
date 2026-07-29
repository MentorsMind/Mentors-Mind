import { POSTS, MENTORS } from "../data";
import type { MedicalProfessional } from "../data";

import { useAuth } from "../contexts/AuthContext";
import type { AnyMentor } from "../types";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  title?: string;
  company?: string;
  image?: string;
  about?: string;
  category?: string;
  specializations?: { name: string; price: number }[];
  phone?: string;
  state?: string;
  country?: string;
  tips?: { id: string; content: string; createdAt: string; likes: number }[];
}

export function useMentors(): AnyMentor[] {
  useAuth();
  const users = JSON.parse(
    localStorage.getItem("users") || "[]",
  ) as StoredUser[];
  const medicalProfessionals = JSON.parse(
    localStorage.getItem("medicalProfessionals") || "[]",
  ) as MedicalProfessional[];

  const localMentors: AnyMentor[] = users
    .filter((u) => u.role === "mentor")
    .map((u) => ({
      id: u.id,
      name: u.name,
      role: u.title || "New Mentor",
      company: u.company || "Community",
      image: u.image || "",
      about:
        u.about || "I am excited to join MentorMinds and help others grow.",
      rating: 5.0,
      reviews: [],
      sessions: 0,
      experienceYears: "1",
      verified: false,
      tags: u.specializations?.map((s) => s.name) || ["Tech", "Career"],
      category: (u.category || "Tech") as "Tech" | "Business" | "Medical",
      specializations: u.specializations?.map((s) => s.name) || [],
      hourlyRate: u.specializations?.[0]?.price || 0,
      phone: u.phone,
      state: u.state,
      country: u.country,
      tips: u.tips?.map((t) => t.content) || [],
      experience: [],
    }));

  const medicalMentors: AnyMentor[] = medicalProfessionals.map((mp) => ({
    id: mp.id,
    name: mp.name,
    role: mp.role,
    company: mp.practice,
    image: mp.image || "",
    about: mp.about,
    rating: mp.rating,
    reviews: mp.reviews || [],
    sessions: mp.sessions || 0,
    experienceYears: `${mp.experienceYears}`,
    verified: mp.verified,
    tags: mp.specializations,
    category: "Medical",
    specializations: mp.specializations,
    hourlyRate: mp.consultationFee,
    phone: mp.phone,
    state: mp.state,
    country: mp.country,
    tips: [],
    experience: [],
  }));

  return [...MENTORS, ...medicalMentors, ...localMentors];
}

export function usePosts() {
  return POSTS;
}
