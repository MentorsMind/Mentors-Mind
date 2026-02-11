import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Phone, 
  Send,
  Loader2
} from 'lucide-react';

export function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#050B0A] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-[#050B0A]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
                </button>
            </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight">
                    Get in touch with us.
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Have questions about specific mentorships, pricing, or enterprise solutions? We're here to help you every step of the way.
                </p>
            </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Contact Info Cards */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Email Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Chat to us</h3>
                        <p className="text-gray-400 text-sm mb-4">Our friendly team is here to help.</p>
                        <a href="mailto:hello@mentorminds.com" className="text-emerald-500 font-medium hover:text-emerald-400 transition-colors">hello@mentorminds.com</a>
                    </div>

                    {/* Office Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                         <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Visit us</h3>
                        <p className="text-gray-400 text-sm mb-4">Come say hello at our office HQ.</p>
                        <p className="text-white font-medium">100 Tech Plaza, San Francisco</p>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Phone className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Call us</h3>
                        <p className="text-gray-400 text-sm mb-4">Mon-Fri from 8am to 5pm.</p>
                        <p className="text-white font-medium">+1 (555) 000-0000</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden backdrop-blur-sm">
                        
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <Send className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400 max-w-sm">
                                    Thanks for reaching out. Our team will get back to you within 24 hours.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-emerald-500 font-medium hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-4"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">First & Last Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Subject</label>
                                    <select 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange} /* Fixed type incompatibility here by accepting simple event */
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium appearance-none"
                                    >
                                        <option value="" className="bg-[#050B0A] text-gray-400">Select a topic...</option>
                                        <option value="mentorship" className="bg-[#050B0A]">Mentorship Inquiry</option>
                                        <option value="billing" className="bg-[#050B0A]">Billing & Support</option>
                                        <option value="partnership" className="bg-[#050B0A]">Partnerships</option>
                                        <option value="other" className="bg-[#050B0A]">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Stats / Trust */}
            <div className="mt-20 pt-12 border-t border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-white mb-2">24/7</div>
                        <div className="text-gray-500 text-sm">Customer Support</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-2">100+</div>
                        <div className="text-gray-500 text-sm">Countries Served</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-2">98%</div>
                        <div className="text-gray-500 text-sm">Satisfaction Rate</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-2">2hrs</div>
                        <div className="text-gray-500 text-sm">Avg. Response Time</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
