import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Calendar,
  Award,
  Stethoscope,
  GraduationCap,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Shield,
  Users,
  MessageSquare,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useMentors } from './hooks/useData';
import { ConsultationBookingModal } from './components/ConsultationBookingModal';

export function MedicalProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const mentors = useMentors();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const doctor = mentors.find(m => m.id === id && m.category === 'Medical');

  useEffect(() => {
    // If not a medical professional, redirect to regular mentor profile
    if (doctor && doctor.category !== 'Medical') {
      navigate(`/mentor/${id}`);
    }
  }, [doctor, id, navigate]);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="h-full flex items-center justify-center text-slate-900 dark:text-white pt-20">
          <div className="text-center">
            <Stethoscope className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Medical Professional Not Found</h2>
            <button onClick={() => navigate('/medical')} className="text-emerald-600 hover:underline">
              Back to Medical Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ConsultationBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          doctorId={doctor.id}
          doctorName={doctor.name}
          doctorImage={doctor.image}
          consultationFee={doctor.hourlyRate || 0}
          specializations={doctor.tags || []}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/medical')}
          className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Medical Hub</span>
        </button>

        {/* Hero Section - Full Width */}
        <div className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              {/* Doctor Image */}
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {doctor.verified && (
                  <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-3 rounded-full border-4 border-white shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-sm font-semibold">Medical Professional</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Dr. {doctor.name}
                </h1>
                <p className="text-xl text-white/90 font-semibold mb-4">
                  {doctor.role}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold">{doctor.rating}</p>
                      <p className="text-xs text-white/80">Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold">{doctor.sessions}+</p>
                      <p className="text-xs text-white/80">Patients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold">{doctor.experienceYears}</p>
                      <p className="text-xs text-white/80">Years Exp.</p>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {doctor.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking CTA - Integrated in Hero */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-white/80 mb-1">Consultation Fee</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₦{doctor.hourlyRate.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-px h-16 bg-white/20"></div>
                  
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/80" />
                      <span className="text-white/90">2-4 hrs response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-white/80" />
                      <span className="text-white/90">Confidential</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-gray-50 shadow-2xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Book Consultation Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* About Section */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              About Dr. {doctor.name}
            </h2>
            <p className={`text-slate-600 dark:text-gray-400 leading-relaxed ${!showFullBio && 'line-clamp-6'}`}>
              {doctor.about}
            </p>
            {doctor.about.length > 200 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-3 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline"
              >
                {showFullBio ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Contact & Location */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Contact & Location
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-gray-500">Practice</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{doctor.company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-gray-500">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{doctor.state}, {doctor.country}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-gray-500">Phone</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{doctor.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials - Full Width */}
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-2xl p-8 border border-emerald-100 dark:border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-7 h-7 text-emerald-600" />
            Professional Credentials & Qualifications
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-[#1a2e22] rounded-xl border border-emerald-200 dark:border-white/10">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1">Licensed Professional</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">Verified medical credentials</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-[#1a2e22] rounded-xl border border-blue-200 dark:border-white/10">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1">{doctor.experienceYears}+ Years Experience</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">Extensive medical practice</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-[#1a2e22] rounded-xl border border-purple-200 dark:border-white/10">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-1">Specialized Training</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">{doctor.tags.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Stats */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Performance Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">Success Rate</span>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">Total Patients</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{doctor.sessions}+</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">Patient Rating</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{doctor.rating}/5.0</span>
              </div>
            </div>
          </div>

          {/* Patient Reviews */}
          {doctor.reviews && doctor.reviews.length > 0 && (
            <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-white/10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                Patient Reviews
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {doctor.reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={review.image}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{review.author}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 italic">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Book Your Consultation?</h3>
          <p className="text-white/90 mb-6">Get professional medical advice from Dr. {doctor.name}</p>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-gray-50 shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Book Consultation - ₦{doctor.hourlyRate.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
