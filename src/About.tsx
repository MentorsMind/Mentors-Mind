import { Quote, Target, Eye, Users, CheckCircle2, BookOpen, Award, Zap } from 'lucide-react';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingFooter } from './components/LandingFooter';

export function About() {
  return (
    <div className="min-h-screen bg-[#050B0A] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <LandingNavbar />
      
      {/* Content wrapper with padding for navbar */}
      <div className="pt-24 pb-8">
      
        {/* About Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Main Intro */}
            <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 uppercase tracking-wider">
                  <Quote className="w-3 h-3" />
                  Who We Are
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                 Building the Future of <br />
                 <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Mentorship & Growth</span>
               </h2>
               <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                 <p>
                   We are building a mentorship-driven startup forum designed to connect great minds 
                   with the guidance they need to grow, learn, and succeed.
                 </p>
                 <p>
                   In a world where access to quality mentorship is limited, we exist to bridge the gap 
                   between people who are eager to learn and experts who are ready to teach, guide, and inspire. 
                   Our platform brings together learners and mentors across Technology, Business, and Medical fields, 
                   creating a collaborative space where real problems meet real solutions.
                 </p>
                 <p>
                   We believe growth happens faster when knowledge is shared. That’s why our community is built 
                   around problem-solving, mentorship, and practical learning. From asking questions and sharing 
                   insights to receiving one-on-one guidance and structured learning paths, we empower individuals 
                   to move from curiosity to competence. <strong>At our core, we are more than a platform — we are a community committed 
                   to nurturing potential and guiding great minds to greatness.</strong>
                 </p>
               </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {/* Mission */}
              <div className="relative group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-500">
                 <div className="absolute inset-0 bg-[#050B0A] rounded-[22px] m-[1px] z-0" />
                 <div className="relative z-10 p-8 h-full flex flex-col items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Target className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                      <p className="text-gray-400 leading-relaxed">
                        To make mentorship accessible and impactful by connecting learners with experienced mentors 
                        who can help them solve problems, build skills, and achieve meaningful growth.
                      </p>
                    </div>
                 </div>
              </div>

            {/* Vision */}
            <div className="relative group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-blue-500/20 hover:to-indigo-500/20 transition-all duration-500">
               <div className="absolute inset-0 bg-[#050B0A] rounded-[22px] m-[1px] z-0" />
               <div className="relative z-10 p-8 h-full flex flex-col items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Eye className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                    <p className="text-gray-400 leading-relaxed">
                      To become a leading mentorship and learning ecosystem where knowledge, experience, and 
                      innovation come together to shape the next generation of leaders in tech, business, and healthcare.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* About the Founder */}
          <div className="mb-24">
             <h3 className="text-3xl font-bold text-center text-white mb-16">Meet the Founder</h3>
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#0A1211] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start gap-12">
                        {/* Founder Image Placeholder */}
                        <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-6">
                           <div className="aspect-[4/5] w-full rounded-2xl bg-gray-800 bg-[url('/img/founder.jpg')] bg-cover bg-center border border-white/10 shadow-2xl skew-y-0 group-hover:skew-y-1 transition-transform duration-500 ease-out"></div>
                           <div className="text-center md:text-left">
                               <h4 className="text-2xl font-bold text-white mb-1">Benjamin Alex</h4>
                               <p className="text-emerald-400 font-medium tracking-wide uppercase text-sm">CEO & Founder</p>
                           </div>
                        </div>
                        
                        {/* Founder Bio */}
                        <div className="w-full md:w-2/3 space-y-6 text-gray-300 text-lg leading-relaxed">
                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-500 first-letter:float-left first-letter:mr-3">
                                This platform was founded with a simple but powerful belief that great minds deserve access to guidance, not just information.
                            </p>
                            <p>
                                As a builder, mentor, and lifelong learner, Benjamin experienced firsthand how difficult it can be to find the right mentorship, whether in technology, business, or the medical field. Too often, people with potential are held back not by lack of talent but by lack of direction, support, and access to experienced voices.
                            </p>
                            <p>
                                Driven by this reality, he set out to create a space where learning is practical, mentorship is accessible, and problems are treated as opportunities for growth.
                            </p>
                            <p>
                                This platform is designed as more than a forum. It is a mentorship-driven ecosystem where learners can ask real questions, mentors can share real experience, and communities can grow through collaboration. By bringing together people who want to learn with those willing to teach, the goal is to guide great minds to greatness.
                            </p>
                            <div className="pl-6 border-l-2 border-emerald-500/30 italic text-gray-400 my-8">
                                "At the heart of this initiative is a commitment to impact, growth, and shared success. We foster a culture where knowledge is respected, curiosity is encouraged, and progress is celebrated."
                            </div>
                            <p className="font-medium text-white">
                                This is not just a product; it is a mission to empower the next generation of thinkers, builders, and leaders.
                            </p>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Core Values */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-12 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                What We Stand For
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Mentorship First", desc: "Guidance matters.", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                  { title: "Community-driven", desc: "We grow together.", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { title: "Practical Learning", desc: "Real problems, real solutions.", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                  { title: "Excellence & Impact", desc: "Quality over noise.", icon: Award, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" }
                ].map((val, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl bg-[#0A1211] border ${val.border} hover:bg-[#0F1A18] transition-colors group text-left`}>
                    <div className={`w-10 h-10 rounded-lg ${val.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <val.icon className={`w-5 h-5 ${val.color}`} />
                    </div>
                    <h4 className="font-bold text-white mb-1">{val.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}
