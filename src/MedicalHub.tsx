import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  Search, 
  Stethoscope, 
  Star, 
  Check, 
  Activity,
  Heart,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Award,
  Brain,
  Baby,
  Eye,
  Bone,
  Pill,
  HeartPulse,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Calendar,
  AlertCircle,
  Droplet,
  Apple,
  Sunrise,
  Moon,
  Zap
} from 'lucide-react';
import { useMentors } from './hooks/useData';
import { LandingFooter } from './components/LandingFooter';
import { ConsultationBookingModal } from './components/ConsultationBookingModal';
import { useMessages } from './contexts/MessageContext';

export function MedicalHub() {
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { createThread } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const mentors = useMentors();

  // Filter for Medical Professionals ONLY
  const medicalPros = mentors.filter(m => m.category === 'Medical');

  const filteredPros = medicalPros.filter(pro => {
    // In a real app we might have sub-categories here
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pro.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pro.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex flex-col relative">
        {/* Top Header - Mobile Only */}
        <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 md:hidden">
          <div className="flex items-center p-4 justify-between">
            <button 
               onClick={() => navigate('/')}
               className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="text-slate-900 dark:text-white w-6 h-6" />
            </button>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-2">Medical Consultation</h1>
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
              <Bell className="text-slate-900 dark:text-white w-6 h-6" />
            </button>
          </div>
        </header>
        
        {/* Desktop Header Title */}
        <div className="hidden md:flex items-center justify-between px-4 pt-2">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Stethoscope className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Medical Consultation</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Connect with verified doctors and specialists</p>
                </div>
             </div>
             <button className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-[#29382f] border border-gray-100 dark:border-white/10 shadow-sm">
                <Bell className="w-5 h-5 text-slate-600 dark:text-gray-300" />
             </button>
         </div>

        {/* Health Importance Hero Section */}
        <div className="px-4 py-8 md:py-12 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 mx-4 mt-6 rounded-3xl border border-red-100 dark:border-red-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
                  <Heart className="w-4 h-4 animate-pulse" />
                  Your Health, Our Priority
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                  Why Your Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Matters Most</span>
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Access to quality healthcare shouldn't be complicated. Connect with verified medical professionals 
                  who understand your needs and provide expert guidance when you need it most.
                </p>
                
                <button
                  onClick={() => navigate('/doctors')}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-red-600 hover:to-pink-600 shadow-2xl shadow-red-500/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                >
                  <Stethoscope className="w-6 h-6" />
                  Browse All Medical Specialists
                </button>
              </div>

              {/* Image */}
              <div className="relative order-first md:order-last">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
                  <img 
                    src="/img/medical-consultation.png" 
                    alt="Doctor providing compassionate care to a young patient" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              {[
                { icon: Users, value: '50+', label: 'Medical Experts' },
                { icon: Award, value: '98%', label: 'Satisfaction Rate' },
                { icon: Clock, value: '24/7', label: 'Availability' },
                { icon: TrendingUp, value: '1000+', label: 'Consultations' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-6 rounded-2xl border border-red-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <stat.icon className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                {
                  icon: Shield,
                  title: 'Expert Medical Advice',
                  description: 'Consult with certified doctors and specialists who provide professional, reliable healthcare guidance.'
                },
                {
                  icon: Clock,
                  title: 'Convenient Access',
                  description: 'Book consultations at your convenience. No long waits, no complicated processes.'
                },
                {
                  icon: Heart,
                  title: 'Personalized Care',
                  description: 'Receive tailored medical advice that addresses your specific health concerns and needs.'
                }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-6 rounded-2xl border border-red-100 dark:border-white/10 hover:border-red-300 dark:hover:border-red-500/30 transition-all hover:shadow-lg group">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl w-fit mb-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                    <benefit.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Importance of Regular Checkups Section */}
        <div className="px-4 py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/10 dark:to-cyan-950/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Why Regular <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Medical Checkups Matter</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Prevention is better than cure. Regular health checkups can detect problems early, when chances for treatment and cure are better.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: AlertCircle,
                  title: 'Early Detection Saves Lives',
                  description: 'Many serious conditions like cancer, diabetes, and heart disease show no symptoms in early stages. Regular screening can catch these before they become life-threatening.',
                  stats: '85% survival rate with early detection',
                  color: 'from-red-500 to-orange-500'
                },
                {
                  icon: TrendingUp,
                  title: 'Track Your Health Progress',
                  description: 'Regular checkups help monitor changes in your health over time, allowing you to see improvements and address concerning trends before they escalate.',
                  stats: 'Reduce health risks by 40%',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Pill,
                  title: 'Reduce Healthcare Costs',
                  description: 'Preventive care is far less expensive than treating advanced diseases. Early intervention can save thousands in medical expenses.',
                  stats: 'Save up to 70% on treatment costs',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Heart,
                  title: 'Peace of Mind',
                  description: 'Knowing your health status reduces anxiety and allows you to make informed decisions about your lifestyle and future.',
                  stats: 'Better quality of life',
                  color: 'from-pink-500 to-rose-500'
                }
              ].map((reason, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all group">
                  <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${reason.color} mb-4`}>
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{reason.title}</h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">{reason.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{reason.stats}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 md:p-12 rounded-3xl text-center text-white">
              <Calendar className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Recommended Checkup Schedule</h3>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <p className="text-3xl font-bold mb-2">18-39</p>
                  <p className="text-sm opacity-90">Every 2-3 years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <p className="text-3xl font-bold mb-2">40-64</p>
                  <p className="text-sm opacity-90">Every 1-2 years</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <p className="text-3xl font-bold mb-2">65+</p>
                  <p className="text-sm opacity-90">Annually</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-semibold mb-4">
                <Lightbulb className="w-4 h-4" />
                Expert Health Tips
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Essential <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">Health Tips</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg">
                Simple daily habits that can dramatically improve your overall health and wellbeing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Droplet,
                  title: 'Stay Hydrated',
                  tip: 'Drink at least 8 glasses of water daily',
                  details: 'Proper hydration improves digestion, skin health, and helps flush out toxins.',
                  color: 'text-blue-500'
                },
                {
                  icon: Apple,
                  title: 'Balanced Nutrition',
                  tip: 'Eat colorful fruits and vegetables',
                  details: 'A varied diet ensures you get all essential vitamins and minerals for optimal health.',
                  color: 'text-green-500'
                },
                {
                  icon: Activity,
                  title: 'Regular Exercise',
                  tip: '30 minutes of movement daily',
                  details: 'Physical activity reduces risk of chronic diseases and improves mental health.',
                  color: 'text-red-500'
                },
                {
                  icon: Moon,
                  title: 'Quality Sleep',
                  tip: '7-9 hours every night',
                  details: 'Adequate sleep strengthens immunity, improves memory, and supports emotional wellbeing.',
                  color: 'text-indigo-500'
                },
                {
                  icon: Shield,
                  title: 'Stress Management',
                  tip: 'Practice mindfulness or meditation',
                  details: 'Managing stress reduces inflammation and lowers risk of heart disease and depression.',
                  color: 'text-purple-500'
                },
                {
                  icon: Sunrise,
                  title: 'Sun Protection',
                  tip: 'Use SPF 30+ sunscreen daily',
                  details: 'Protect your skin from harmful UV rays to prevent premature aging and skin cancer.',
                  color: 'text-orange-500'
                }
              ].map((tip, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-yellow-200 dark:hover:border-yellow-500/30 transition-all hover:shadow-lg group">
                  <div className={`inline-block p-3 rounded-lg bg-gray-50 dark:bg-white/5 mb-4 group-hover:scale-110 transition-transform`}>
                    <tip.icon className={`w-6 h-6 ${tip.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{tip.title}</h3>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">✓ {tip.tip}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{tip.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preventive Healthcare Section */}
        <div className="px-4 py-16 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Preventive Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Essentials</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg">
                Key preventive measures everyone should take for long-term health
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Stethoscope,
                  title: 'Annual Physical Exam',
                  description: 'Comprehensive health assessment to catch issues early'
                },
                {
                  icon: Heart,
                  title: 'Blood Pressure Check',
                  description: 'Monitor cardiovascular health regularly'
                },
                {
                  icon: Activity,
                  title: 'Blood Tests',
                  description: 'Check cholesterol, glucose, and vitamin levels'
                },
                {
                  icon: Eye,
                  title: 'Vision Screening',
                  description: 'Detect eye problems and vision changes'
                },
                {
                  icon: Shield,
                  title: 'Vaccinations',
                  description: 'Stay up-to-date with recommended immunizations'
                },
                {
                  icon: Brain,
                  title: 'Mental Health Check',
                  description: 'Screen for depression, anxiety, and stress'
                },
                {
                  icon: Bone,
                  title: 'Bone Density Test',
                  description: 'Prevent osteoporosis with early screening'
                },
                {
                  icon: Zap,
                  title: 'Cancer Screenings',
                  description: 'Age-appropriate cancer detection tests'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-6 rounded-xl border border-purple-100 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all hover:shadow-lg text-center group">
                  <div className="inline-block p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>

        {/* How It Works Section */}
        <div className="px-4 py-16 md:py-20 bg-gradient-to-br from-slate-50 to-white dark:from-[#0e1612] dark:to-[#1a2e22] mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Works</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Getting expert medical consultation is simple and straightforward
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Browse Specialists',
                  description: 'Explore our network of verified medical professionals across various specialties.',
                  icon: Search,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '02',
                  title: 'Book Consultation',
                  description: 'Choose your preferred specialist and schedule a consultation at your convenience.',
                  icon: Clock,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  step: '03',
                  title: 'Get Expert Care',
                  description: 'Receive professional medical advice and personalized treatment recommendations.',
                  icon: CheckCircle2,
                  color: 'from-red-500 to-orange-500'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-white dark:bg-[#1a2e22] p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 transition-all hover:shadow-xl">
                    <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${item.color} mb-6`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-6 right-6 text-6xl font-bold text-slate-100 dark:text-white/5">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical Specialties Section */}
        <div className="px-4 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Our Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Specialties</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg">
                Comprehensive healthcare across multiple medical fields
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Brain, name: 'Neurology', color: 'text-purple-500' },
                { icon: Heart, name: 'Cardiology', color: 'text-red-500' },
                { icon: Baby, name: 'Pediatrics', color: 'text-pink-500' },
                { icon: Bone, name: 'Orthopedics', color: 'text-blue-500' },
                { icon: Eye, name: 'Ophthalmology', color: 'text-cyan-500' },
                { icon: Pill, name: 'Pharmacy', color: 'text-green-500' },
                { icon: HeartPulse, name: 'Therapy', color: 'text-orange-500' },
                { icon: Stethoscope, name: 'General', color: 'text-indigo-500' },
                { icon: Activity, name: 'Emergency', color: 'text-red-600' },
                { icon: Shield, name: 'Preventive', color: 'text-emerald-500' },
                { icon: Users, name: 'Family Care', color: 'text-violet-500' },
                { icon: Heart, name: 'Women\'s Health', color: 'text-rose-500' }
              ].map((specialty, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1a2e22] p-6 rounded-xl border border-gray-100 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 transition-all hover:shadow-lg cursor-pointer group text-center"
                >
                  <div className={`inline-block p-3 rounded-lg bg-${specialty.color.split('-')[1]}-50 dark:bg-white/5 mb-3 group-hover:scale-110 transition-transform`}>
                    <specialty.icon className={`w-6 h-6 ${specialty.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{specialty.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Questions</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg">
                Everything you need to know about our medical consultation service
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'How do I book a consultation?',
                  answer: 'Simply browse our specialists, select your preferred doctor, and click the "Book Consult" button. Fill in your details and preferred time, and we\'ll confirm your appointment.'
                },
                {
                  question: 'Are all doctors verified?',
                  answer: 'Yes! All our medical professionals are licensed, certified, and thoroughly vetted. Look for the verified badge on their profiles.'
                },
                {
                  question: 'What if I need to reschedule?',
                  answer: 'You can reschedule your appointment by contacting the specialist directly through the chat feature or by reaching out to our support team.'
                },
                {
                  question: 'Is my health information secure?',
                  answer: 'Absolutely. We use industry-standard encryption and comply with all health data protection regulations to keep your information safe and confidential.'
                },
                {
                  question: 'Can I get a second opinion?',
                  answer: 'Yes! You can consult with multiple specialists to get different perspectives on your health concerns.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a2e22] p-6 rounded-xl border border-gray-100 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Medical Specialists Section - Moved to End */}
        <div className="px-4 py-16 md:py-20 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/10 dark:to-pink-950/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Our Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Specialists</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-8">
                Connect with expert healthcare professionals ready to help you
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <label className="flex flex-col h-14 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-2xl h-full shadow-md hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-center pl-4 bg-white dark:bg-[#29382f] rounded-l-2xl border-r-0 group-focus-within:ring-2 group-focus-within:ring-red-500/20">
                      <Search className="text-slate-400 dark:text-[#9eb7a7] w-6 h-6" />
                    </div>
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-2xl text-slate-900 dark:text-white focus:outline-0 border-none bg-white dark:bg-[#29382f] placeholder:text-slate-400 dark:placeholder:text-[#9eb7a7] px-4 text-base font-normal leading-normal" 
                      placeholder="Find a specialist (e.g. Cardiologist, Dentist)..." 
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 justify-center">
              {['All Specialists', 'General', 'Dental', 'Therapy', 'Pediatric'].map((cat) => (
                <button 
                  key={cat}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 transition-all ${
                    cat === 'All Specialists'
                      ? 'bg-red-500 border-red-500 text-white shadow-lg' 
                      : 'bg-white dark:bg-[#29382f] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-red-50 dark:hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm font-semibold">{cat}</p>
                </button>
              ))}
            </div>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPros.map((doctor: any) => (
                <div 
                  key={doctor.id}
                  onClick={() => navigate(`/medical-profile/${doctor.id}`)}
                  className="flex flex-col items-stretch justify-start rounded-2xl bg-white dark:bg-[#1a2e22] shadow-md border border-red-100 dark:border-white/10 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full group"
                >
                  <div className="relative h-24 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10">
                    <div className="absolute top-4 right-4 flex gap-1">
                      {doctor.verified && (
                        <div className="bg-white/95 dark:bg-black/60 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" /> Verified
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 -mt-12 flex flex-col flex-1">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg mb-3 self-start ring-2 ring-white dark:ring-[#1a2e22]">
                      <img src={doctor.image} className="w-full h-full object-cover rounded-xl" alt={doctor.name} />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-red-500 transition-colors">{doctor.name}</h3>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{doctor.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{doctor.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{doctor.about}</p>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          createThread(doctor.id, doctor.name, doctor.image);
                          navigate(`/messages`);
                        }}
                        className="py-2.5 rounded-xl border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        Chat
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMentor(doctor);
                          setIsBookingOpen(true);
                        }}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPros.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <div className="bg-red-100 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No specialists found</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Join Our Medical Team Section */}
        <div className="px-4 py-16 md:py-20 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950/10 dark:via-cyan-950/10 dark:to-blue-950/10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-[#1a2e22] rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-white/10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center p-8 md:p-12">
                {/* Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
                    <Users className="w-4 h-4" />
                    Join Our Network
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    Are You a Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Professional?</span>
                  </h2>
                  
                  <p className="text-lg text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Join our growing community of verified medical specialists and help patients access quality healthcare. 
                    Expand your practice and make a difference in people's lives.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      'Reach more patients seeking expert care',
                      'Flexible consultation scheduling',
                      'Secure platform for patient communication',
                      'Build your professional reputation'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-slate-700 dark:text-gray-300">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/medical-registration')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95 w-full"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Register as a Medical Professional
                      <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-2">Already registered?</p>
                    <button
                      onClick={() => navigate('/medical-login')}
                      className="px-6 py-2 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                    >
                      Sign In to Dashboard
                    </button>
                  </div>
                </div>

                {/* Image/Illustration */}
                <div className="relative order-first md:order-last">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Stats/Benefits Cards */}
                      <div className="bg-white dark:bg-[#29382f] p-6 rounded-xl shadow-lg border border-emerald-200 dark:border-white/10 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">1000+</p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">Active Patients</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#29382f] p-6 rounded-xl shadow-lg border border-cyan-200 dark:border-white/10 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                            <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">98%</p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">Satisfaction Rate</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#29382f] p-6 rounded-xl shadow-lg border border-blue-200 dark:border-white/10 transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">Growing</p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">Community</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LandingFooter />
        
        {/* Consultation Booking Modal */}
        {selectedMentor && (
          <ConsultationBookingModal
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedMentor(null);
            }}
            doctorId={selectedMentor.id}
            doctorName={selectedMentor.name}
            doctorImage={selectedMentor.image}
            consultationFee={selectedMentor.hourlyRate || 0}
            specializations={selectedMentor.tags || []}
          />
        )}
      </div>
  
  );
}
