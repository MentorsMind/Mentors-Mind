import { POSTS, MENTORS } from '../data';
import type { MedicalProfessional } from '../data';

import { useAuth } from '../contexts/AuthContext';

export function useMentors() {
  // We subscribe to auth changes so this hook re-runs when the user updates their profile
  useAuth(); 
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const medicalProfessionals = JSON.parse(localStorage.getItem('medicalProfessionals') || '[]');
  
  // Map local user data to Mentor interface structure
  const localMentors = users
    .filter((u: any) => u.role === 'mentor')
    .map((u: any) => ({
      id: u.id,
      name: u.name,
      role: u.title || 'New Mentor',
      company: u.company || 'Community',
      image: u.image,
      about: u.about || 'I am excited to join MentorMinds and help others grow.',
      rating: 5.0, // Default rating for new mentors
      reviews: [],
      sessions: 0,
      experienceYears: 1,
      verified: false,
      tags: ['Tech', 'Career'], // Default tags to ensure visibility
      category: u.category || 'Tech', // User's selected category or default
      specializations: u.specializations || [],
      hourlyRate: 0,
      phone: u.phone,
      state: u.state,
      country: u.country,
      tips: u.tips || [],
      experience: []
    }));

  // Map medical professionals to mentor format
  const medicalMentors = medicalProfessionals.map((mp: MedicalProfessional) => ({
    id: mp.id,
    name: mp.name,
    role: mp.role,
    company: mp.practice,
    image: mp.image,
    about: mp.about,
    rating: mp.rating,
    reviews: mp.reviews || [],
    sessions: mp.sessions || 0,
    experienceYears: `${mp.experienceYears} years`,
    verified: mp.verified,
    tags: mp.specializations,
    category: 'Medical' as const,
    specializations: mp.specializations,
    hourlyRate: mp.consultationFee,
    phone: mp.phone,
    state: mp.state,
    country: mp.country,
    experience: []
  }));

  // Combine static MENTORS with medical professionals and local mentors
  return [...MENTORS, ...medicalMentors, ...localMentors];
}

export function usePosts() {
    return POSTS;
}
