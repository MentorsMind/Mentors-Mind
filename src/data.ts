export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  image: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  logo: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  category: 'Tech' | 'Business' | 'Medical';
  rating: number;
  sessions: number;
  experienceYears: string;
  about: string;
  tags: string[];
  reviews: Review[];
  experience: Experience[];
  hourlyRate: number;
  verified: boolean;
}

export interface MedicalProfessional {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string; // e.g., "Cardiologist", "Pediatrician"
  licenseNumber: string;
  experienceYears: number;
  practice: string; // Hospital/Clinic name
  specializations: string[];
  about: string;
  image: string;
  phone: string;
  state: string;
  country: string;
  consultationFee: number;
  rating: number;
  verified: boolean;
  registeredAt: string;
  sessions?: number;
  reviews?: Review[];
}

export interface ConsultationBooking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}


export interface Post {
  id: string;
  author: string;
  authorImage: string;
  timeAgo: string;
  title: string;
  content: string;
  category: 'Tech' | 'Business' | 'Medical';
  answers: number;
  votes: number;
}

export const POSTS: Post[] = [];

export const MENTORS: Mentor[] = [
  {
    id: 'med-1',
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    company: 'Heart Care Medical Center',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.9,
    sessions: 245,
    experienceYears: '15 years',
    about: 'Board-certified cardiologist specializing in preventive cardiology and heart disease management. Passionate about helping patients maintain optimal cardiovascular health through lifestyle modifications and evidence-based treatments.',
    tags: ['Cardiology', 'Heart Health', 'Preventive Care'],
    reviews: [],
    experience: [],
    hourlyRate: 15000,
    verified: true
  },
  {
    id: 'med-2',
    name: 'Dr. Michael Chen',
    role: 'Pediatrician',
    company: 'Children\'s Health Clinic',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 5.0,
    sessions: 312,
    experienceYears: '12 years',
    about: 'Dedicated pediatrician with extensive experience in child development, immunizations, and pediatric care. I believe in building strong relationships with families to ensure the best outcomes for children.',
    tags: ['Pediatrics', 'Child Health', 'Vaccinations'],
    reviews: [],
    experience: [],
    hourlyRate: 12000,
    verified: true
  },
  {
    id: 'med-3',
    name: 'Dr. Emily Williams',
    role: 'General Practitioner',
    company: 'Community Health Center',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.8,
    sessions: 428,
    experienceYears: '10 years',
    about: 'Experienced family physician providing comprehensive primary care for patients of all ages. Focused on preventive medicine, chronic disease management, and patient education.',
    tags: ['General Medicine', 'Primary Care', 'Family Health'],
    reviews: [],
    experience: [],
    hourlyRate: 10000,
    verified: true
  },
  {
    id: 'med-4',
    name: 'Dr. James Anderson',
    role: 'Dentist',
    company: 'Bright Smile Dental',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.7,
    sessions: 189,
    experienceYears: '8 years',
    about: 'Skilled dentist specializing in cosmetic and restorative dentistry. Committed to providing pain-free dental care and helping patients achieve healthy, beautiful smiles.',
    tags: ['Dentistry', 'Oral Health', 'Cosmetic Dentistry'],
    reviews: [],
    experience: [],
    hourlyRate: 8000,
    verified: true
  },
  {
    id: 'med-5',
    name: 'Dr. Olivia Martinez',
    role: 'Clinical Psychologist',
    company: 'Mind & Wellness Center',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.9,
    sessions: 267,
    experienceYears: '14 years',
    about: 'Licensed clinical psychologist specializing in anxiety, depression, and stress management. I use evidence-based therapeutic approaches to help clients achieve mental wellness and personal growth.',
    tags: ['Therapy', 'Mental Health', 'Counseling'],
    reviews: [],
    experience: [],
    hourlyRate: 11000,
    verified: true
  },
  {
    id: 'med-6',
    name: 'Dr. David Thompson',
    role: 'Orthopedic Surgeon',
    company: 'Sports Medicine Institute',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.8,
    sessions: 156,
    experienceYears: '18 years',
    about: 'Board-certified orthopedic surgeon with expertise in sports injuries, joint replacement, and musculoskeletal conditions. Dedicated to helping patients regain mobility and return to active lifestyles.',
    tags: ['Orthopedics', 'Sports Medicine', 'Surgery'],
    reviews: [],
    experience: [],
    hourlyRate: 18000,
    verified: true
  },
  {
    id: 'med-7',
    name: 'Dr. Rachel Kim',
    role: 'Dermatologist',
    company: 'Skin Health Clinic',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.9,
    sessions: 203,
    experienceYears: '11 years',
    about: 'Expert dermatologist specializing in medical and cosmetic dermatology. Helping patients achieve healthy skin through personalized treatment plans and advanced dermatological procedures.',
    tags: ['Dermatology', 'Skin Care', 'Cosmetic Procedures'],
    reviews: [],
    experience: [],
    hourlyRate: 13000,
    verified: true
  },
  {
    id: 'med-8',
    name: 'Dr. Robert Brown',
    role: 'Ophthalmologist',
    company: 'Vision Care Center',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
    category: 'Medical',
    rating: 4.7,
    sessions: 178,
    experienceYears: '16 years',
    about: 'Experienced ophthalmologist providing comprehensive eye care, from routine exams to advanced surgical procedures. Committed to preserving and improving patients\' vision and eye health.',
    tags: ['Ophthalmology', 'Eye Care', 'Vision Health'],
    reviews: [],
    experience: [],
    hourlyRate: 14000,
    verified: true
  }
];

export const MEDICAL_PROFESSIONALS: MedicalProfessional[] = [];
