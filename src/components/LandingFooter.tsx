import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/logo.png';

export function LandingFooter() {
  const [activeFooterSection, setActiveFooterSection] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <footer className="py-20 border-t border-white/5 bg-[#050B0A] relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col items-start">
               <div className="flex items-center gap-2 mb-6">
                <img src={logo} alt="Bentechnology" className="h-10 w-auto object-contain animate-bounce" />
                <span className="text-xl font-bold font-google text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  MentorMinds
                </span>
              </div>
              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
                Empowering the next generation of leaders through direct mentorship. Connect with world-class experts today.
              </p>
              
              {/* Newsletter */}
              <div className="w-full max-w-sm">
                <h5 className="font-semibold text-white mb-2">Join our newsletter</h5>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2.5 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-12 lg:col-span-1 hidden lg:block"></div>

            {/* Links Columns */}
            {[
              {
                title: "Platform",
                links: ["Browse Mentors", "How It Works", "Pricing", "Success Stories"]
              },
              {
                title: "Company",
                links: ["About Us", "Become a Mentor", "Careers", "Contact"]
              },
              {
                title: "Resources",
                links: ["Blog", "Community", "Help Center", "Support"]
              }
            ].map((section, idx) => (
              <div key={idx} className="md:col-span-4 lg:col-span-2">
                <button 
                  onClick={() => setActiveFooterSection(activeFooterSection === section.title ? null : section.title)}
                  className="flex items-center justify-between w-full md:cursor-default group"
                >
                  <h4 className="font-bold text-white mb-4 md:mb-6">{section.title}</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 md:hidden transition-transform duration-300 ${activeFooterSection === section.title ? 'rotate-180' : ''}`} 
                  />
                </button>
                <ul className={`space-y-4 text-sm text-gray-400 overflow-hidden transition-all duration-300 ${activeFooterSection === section.title ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100 md:mb-0'}`}>
                  {section.links.map((link) => (
                    <li key={link}>
                      {link === "Become a Mentor" ? (
                        <button onClick={() => navigate('/signup')} className="hover:text-emerald-400 transition-colors text-left block hover:translate-x-1 duration-200">{link}</button>
                      ) : link === "Contact" ? (
                        <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition-colors text-left block hover:translate-x-1 duration-200">{link}</button>
                      ) : link === "About Us" ? (
                        <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition-colors text-left block hover:translate-x-1 duration-200">{link}</button>
                      ) : (
                        <a href="#" className="hover:text-emerald-400 transition-colors block hover:translate-x-1 duration-200">{link}</a>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex md:hidden gap-4 items-center mb-0">
               <span className="text-gray-400 text-sm font-medium mr-2">Follow Us</span>
               <div className="flex gap-4">
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-[#1DA1F2] transition-colors" />
                  </a>
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Instagram className="w-5 h-5 text-gray-400 hover:text-[#E1306C] transition-colors" />
                  </a>
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#0077B5] transition-colors" />
                  </a>
               </div>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 MentorMinds Inc. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>

            <div className="hidden md:flex gap-4 items-center">
               <span className="text-gray-400 text-sm font-medium mr-2">Follow Us</span>
               <div className="flex gap-4">
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-[#1DA1F2] transition-colors" />
                  </a>
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Instagram className="w-5 h-5 text-gray-400 hover:text-[#E1306C] transition-colors" />
                  </a>
                  <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                    <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#0077B5] transition-colors" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </footer>
  );
}
