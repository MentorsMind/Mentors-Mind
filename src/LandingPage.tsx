
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingFooter } from './components/LandingFooter';
import { LandingBottomNav } from './components/LandingBottomNav';
import { useAuth } from './contexts/AuthContext';
import { useMentors } from './hooks/useData';
import { CodeBackground } from './components/CodeBackground';
import { 
  ArrowRight, 
  Search, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Stethoscope,
  Heart,
  Clock
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import heroTech from './assets/hero-tech.jpg';
import heroMedical from './assets/hero-medical.jpg';
import conceptIllustration from '/img/concept-illustration.png';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mentors } = useMentors();
  const allMentors = mentors || [];
  
  const [mentorsVisible, setMentorsVisible] = useState(false);
  const mentorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMentorsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (mentorsRef.current) {
      observer.observe(mentorsRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  // Get top 3 rated mentors or just first 3 for showcase
  const featuredMentors = allMentors
    .filter((m: any) => m.image) 
    .slice(0, 3); 

  // Fallback if no mentors yet
  const displayMentors = featuredMentors.length > 0 ? featuredMentors : [
    { id: '1', name: 'Dr. Sarah Chen', role: 'Chief Tech Officer', company: 'TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400' },
    { id: '2', name: 'Michael Ross', role: 'Head of Product', company: 'Creative Inc', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400' },
    { id: '3', name: 'Priya Patel', role: 'Senior Surgeon', company: 'City Hospital', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400' }
  ];

  return (
    <div className="min-h-screen bg-[#050B0A] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 md:hidden z-0 overflow-hidden">
            <img 
                src={heroTech} 
                alt="Background" 
                className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050B0A] via-[#050B0A]/80 to-[#050B0A]"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20 relative z-10">
            
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-20 relative order-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 md:mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Join 2,000+ Learners Today
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight font-google">
                    Expert Guidance. <br />
                    <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">
                        Real Growth.
                    </span>
                </h1>
                
                <p className="max-w-xl text-gray-400 text-lg md:text-xl mb-6 md:mb-10 leading-relaxed">
                    Don't struggle alone. Get 1-on-1 mentorship from verified leaders in Tech, Business, and Medicine.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto md:w-auto">
                    <button 
                         onClick={() => user ? navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/learner-dashboard') : navigate('/signup')}
                        className="px-8 py-4 rounded-xl bg-white text-emerald-950 font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        {user ? 'Go to Dashboard' : 'Get Started'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        Become a Mentor
                    </button>
                </div>

               {/* Mobile Social Proof (Appears below image) */}
            <div className="flex md:hidden flex-col items-center gap-6 text-sm text-gray-300 text-center order-3 w-full relative z-20 pb-4 mt-6">
                <div className="flex -space-x-2">
                    {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                    ].map((src, i) => (
                        <img key={i} src={src} alt="Member" className="w-12 h-12 rounded-full border-2 border-[#050B0A] object-cover animate-[spin_10s_linear_infinite]" />
                    ))}
                </div>
                <p>Join a thriving community of <br/><span className="text-white font-semibold font-google text-base">Learners, Makers, & Industry Leaders</span></p>
            </div>                
                <div className="mt-10 hidden md:flex flex-col sm:flex-row md:flex-row items-center md:items-center gap-4 sm:gap-6 md:gap-8 text-sm text-gray-500 text-center sm:text-left md:text-left relative z-20">
                    <div className="flex -space-x-2 flex-shrink-0">
                        {[
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                        ].map((src, i) => (
                            <img 
                                key={i} 
                                src={src} 
                                alt="Member" 
                                className="w-8 h-8 rounded-full border-2 border-[#050B0A] object-cover animate-[spin_10s_linear_infinite]"
                            />
                        ))}
                    </div>
                    <p>Join a thriving community of <span className="text-gray-300 font-semibold font-google">Learners, Makers, & Industry Leaders</span></p>
                </div>
            </div>


            {/* Right Image Composition */}
            <div className="hidden md:block flex-1 relative w-full h-[450px] sm:h-[550px] md:h-[480px] lg:h-[600px] mt-24 md:mt-0 mb-10 md:mb-0 order-2 z-10">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-[100px] -z-10"></div>
                
                {/* Tech Image (Back) */}
                <div className="absolute top-0 right-0 w-full md:w-[90%] lg:w-[85%] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/40 transform rotate-3 hover:rotate-0 transition-transform duration-700 z-10">
                    <img 
                        src={heroTech} 
                        alt="Tech Mentorship" 
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Medical Image (Front) */}
                <div className="absolute bottom-0 left-0 w-full md:w-[90%] lg:w-[85%] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/40 transform -rotate-3 hover:rotate-0 transition-transform duration-700 z-20">
                     <img 
                        src={heroMedical} 
                        alt="Medical Mentorship" 
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Floating Badge (Centered) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-2xl pr-8 z-30 pointer-events-none w-max">
                    <div className="p-3 bg-emerald-500 rounded-xl text-white">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg font-google">Verified Experts</p>
                        <p className="text-emerald-400 text-sm font-medium">Tech & Medical</p>
                    </div>
                </div>
            </div>
            
        </div>
      </section>

      {/* Featured Mentors Section (The "Concept" Showcase) */}
      <section className="py-12 md:py-20 bg-[#081210] relative overflow-hidden" ref={mentorsRef}>
        <CodeBackground />
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-8 md:mb-16 px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Meet World-Class Mentors</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                      Access the knowledge of experienced professionals who have been in your shoes.
                  </p>
              </div>

              {/* Mobile: Horizontal Scroll Carousel */}
              <div className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
                  <div className="flex gap-6 px-4" style={{ width: 'max-content' }}>
                      {displayMentors.map((mentor: any, index: number) => (
                          <div 
                            key={mentor.id} 
                            onClick={() => user ? navigate(`/mentor/${mentor.id}`) : navigate('/signup')}
                            className={`snap-center group relative flex flex-col items-center transition-all duration-700 cursor-pointer ${mentorsVisible ? 'animate-bounce-in opacity-100' : 'opacity-0'}`}
                            style={{
                                animationDelay: `${index * 150}ms`,
                                animationFillMode: 'both',
                                minWidth: '280px'
                            }}
                          >
                              {/* Circular Card Container */}
                              <div className="w-64 h-64 rounded-full p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 group-active:from-emerald-500 group-active:to-blue-500 transition-all duration-500 mb-6 relative">
                                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#0F1615] relative z-10">
                                      <img 
                                        src={mentor.image} 
                                        alt={mentor.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-active:scale-110"
                                      />
                                       {/* Overlay on tap */}
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-active:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
                                            <p className="text-emerald-400 font-bold text-sm mb-1">{mentor.role}</p>
                                            <p className="text-white text-xs opacity-90">@{mentor.company}</p>
                                            <div className="mt-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                <span>4.9</span> <span className="text-yellow-500">★</span>
                                            </div>
                                       </div>
                                  </div>
                                  
                                  {/* Decor orbits */}
                                  <div className="absolute inset-0 rounded-full border border-white/5 scale-110 group-active:scale-125 transition-transform duration-700 opacity-0 group-active:opacity-100 delay-75"></div>
                              </div>

                              <div className="text-center transition-all duration-300 group-active:-translate-y-2">
                                    <h3 className="text-xl font-bold text-white mb-1 group-active:text-emerald-400 transition-colors">{mentor.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{mentor.category || 'Expert Mentor'}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  {/* Scroll Indicator */}
                  <div className="flex justify-center gap-2 mt-6">
                      {displayMentors.map((_, index) => (
                          <div key={index} className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
                      ))}
                  </div>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 sm:px-6 lg:px-8">
                  {displayMentors.map((mentor: any, index: number) => (
                      <div 
                        key={mentor.id} 
                        onClick={() => user ? navigate(`/mentor/${mentor.id}`) : navigate('/signup')}
                        className={`group relative flex flex-col items-center transition-all duration-700 cursor-pointer ${mentorsVisible ? 'animate-bounce-in opacity-100' : 'opacity-0'}`}
                        style={{
                            animationDelay: `${index * 150}ms`,
                            animationFillMode: 'both' 
                        }}
                      >
                          {/* Circular Card Container */}
                          <div className="w-64 h-64 rounded-full p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500 group-hover:to-blue-500 transition-all duration-500 mb-6 relative">
                              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#0F1615] relative z-10">
                                  <img 
                                    src={mentor.image} 
                                    alt={mentor.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                   {/* Overlay on hover */}
                                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
                                        <p className="text-emerald-400 font-bold text-sm mb-1">{mentor.role}</p>
                                        <p className="text-white text-xs opacity-90">@{mentor.company}</p>
                                        <div className="mt-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <span>4.9</span> <span className="text-yellow-500">★</span>
                                        </div>
                                   </div>
                              </div>
                              
                              {/* Decor orbits */}
                              <div className="absolute inset-0 rounded-full border border-white/5 scale-110 group-hover:scale-125 transition-transform duration-700 opacity-0 group-hover:opacity-100 delay-75"></div>
                          </div>

                          <div className="text-center transition-all duration-300 group-hover:-translate-y-2">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{mentor.name}</h3>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{mentor.category || 'Expert Mentor'}</p>
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-8 md:mt-12 text-center px-4 sm:px-6 lg:px-8">
                  <button 
                    onClick={() => navigate('/mentorship-hub')}
                    className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors border-b-2 border-emerald-500/30 hover:border-emerald-500 pb-1"
                  >
                      View All Mentors <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </section>

      {/* Medical Consultation CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-950/30 via-[#050B0A] to-[#050B0A] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
                <Heart className="w-4 h-4 animate-pulse" />
                Professional Healthcare Access
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Get Expert <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-red-500">
                  Medical Consultation
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with verified doctors and medical specialists for professional consultations. 
                Your health matters, and expert care is just a click away.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Stethoscope, label: 'Verified Doctors', desc: 'Licensed professionals' },
                  { icon: Clock, label: '24/7 Access', desc: 'Book anytime' },
                  { icon: Heart, label: 'Quality Care', desc: 'Expert guidance' }
                ].map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-out"
                    style={{ animationDelay: `${idx * 1}s` }}
                  >
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <feature.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">{feature.label}</p>
                      <p className="text-gray-500 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/medical')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg shadow-2xl shadow-red-500/30 transition-all hover:scale-105 active:scale-100"
              >
                <Stethoscope className="w-6 h-6" />
                Find a Doctor Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-3xl blur-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-700"></div>
                <img 
                  src={heroMedical} 
                  alt="Medical Consultation" 
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700"
                />
                
                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">50+ Specialists</p>
                      <p className="text-red-400 text-sm">Ready to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concept & How It Works Section */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
         {/* Background Orbs */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10"></div>

         <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Illustration */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-700"></div>
                    <img 
                        src={conceptIllustration} 
                        alt="Mentorship Ecosystem" 
                        className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    {/* Floating Caption */}
                    <div className="absolute -bottom-6 -right-6 z-20 bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hidden sm:block animate-bounce-slow">
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg">
                                 <TrendingUp className="w-6 h-6 text-white" />
                             </div>
                             <div>
                                 <p className="text-white font-bold text-lg">Growth Accelerated</p>
                                 <p className="text-emerald-400 text-sm">Join the ecosystem</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Steps */}
            <div className="flex-1 w-full space-y-8">
                <div className="space-y-4 mb-12">
                   <h2 className="text-3xl md:text-5xl font-bold font-google leading-tight">
                       Your Path to <br />
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Mastery starts here.</span>
                   </h2>
                   <p className="text-gray-400 text-lg leading-relaxed">
                       We've simplified the journey from curiosity to expertise. Connect, learn, and grow in a community designed for your success.
                   </p>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: Search, title: "Find Your Guide", desc: "Browse verified mentors tailored to your goals.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                        { icon: Calendar, title: "Book a Session", desc: "Schedule 1:1 time instantly. No friction.", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                        { icon: TrendingUp, title: "Accelerate Growth", desc: "Get actionable advice and level up fast.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
                    ].map((step, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center border ${step.border} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <step.icon className={`w-8 h-8 ${step.color}`} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                                <p className="text-gray-400">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </section>

      <LandingFooter />
      <LandingBottomNav />
    </div>
  );
}
