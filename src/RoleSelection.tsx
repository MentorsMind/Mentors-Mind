import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Rocket, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'mentor' | 'learner' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Tech', 'Business', 'Medical', 'Other'];

  const handleContinue = async () => {
    if (selectedRole) {
      if (selectedRole === 'mentor') {
        if (!selectedCategory) return;
      }
      
      setIsSubmitting(true);
      const userData = location.state;

      if (!userData) {
        navigate('/signup');
        return;
      }

      await signup({ 
          ...userData, 
          role: selectedRole,
          category: selectedRole === 'mentor' ? selectedCategory : undefined
      });

      if (selectedRole === 'learner') {
        navigate('/learner-dashboard');
      } else {
        navigate('/mentor-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white flex flex-col items-center selection:bg-primary selection:text-white transition-colors duration-300">
      
      {/* Header / Top Bar */}
      <header className="w-full max-w-md flex items-center p-6 pb-2 justify-between z-10">
        <div className="w-8"></div>
        <div className="flex gap-2">
          <div className="h-1.5 w-8 rounded-full bg-primary"></div>
          <div className="h-1.5 w-2 rounded-full bg-surface-dark dark:bg-white/20"></div>
          <div className="h-1.5 w-2 rounded-full bg-surface-dark dark:bg-white/20"></div>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-md px-6 pt-6 pb-24 overflow-y-auto no-scrollbar">
        {/* Headlines */}
        <div className="flex flex-col items-center text-center mb-10 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-3">
            Welcome to the Forum
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-relaxed max-w-[280px]">
            To tailor your experience, tell us who you are.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col gap-5 w-full">
          {/* Mentor Card */}
          <label className="group relative cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="mentor" 
              className="peer sr-only"
              onChange={() => setSelectedRole('mentor')}
              checked={selectedRole === 'mentor'}
              disabled={isSubmitting}
            />
            <div className="relative flex items-center p-5 rounded-xl border-2 border-transparent bg-white dark:bg-[#1c2e24] transition-all duration-300 ease-in-out peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:shadow-[0_0_20px_-5px_rgba(16,162,75,0.3)] hover:bg-gray-50 dark:hover:bg-[#25382e]">
              <div className="flex items-center justify-center rounded-full bg-green-100 dark:bg-[#29382f] text-primary shrink-0 w-14 h-14 mr-5 transition-colors peer-checked:bg-primary peer-checked:text-white group-hover:scale-105 duration-300">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">I am a Mentor</span>
                <span className="text-sm font-medium text-slate-500 dark:text-[#9db8a8] leading-snug">Share knowledge & guide startups</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ml-2 ${selectedRole === 'mentor' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                <Check className={`w-4 h-4 text-white transition-opacity ${selectedRole === 'mentor' ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
            {/* Category Selection for Mentor */}
             <div className={`overflow-hidden transition-all duration-300 ease-out ${selectedRole === 'mentor' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2 ml-1">Select your expertise:</p>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={(e) => { e.preventDefault(); setSelectedCategory(cat); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                                selectedCategory === cat 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-white dark:bg-[#29382f] text-slate-600 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-primary hover:text-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
             </div>
          </label>

          {/* Learner Card */}
          <label className="group relative cursor-pointer">
            <input 
              type="radio" 
              name="role" 
              value="learner" 
              className="peer sr-only"
              onChange={() => setSelectedRole('learner')}
              checked={selectedRole === 'learner'}
              disabled={isSubmitting}
            />
            <div className="relative flex items-center p-5 rounded-xl border-2 border-transparent bg-white dark:bg-[#1c2e24] transition-all duration-300 ease-in-out peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:shadow-[0_0_20px_-5px_rgba(16,162,75,0.3)] hover:bg-gray-50 dark:hover:bg-[#25382e]">
              <div className="flex items-center justify-center rounded-full bg-green-100 dark:bg-[#29382f] text-primary shrink-0 w-14 h-14 mr-5 transition-colors peer-checked:bg-primary peer-checked:text-white group-hover:scale-105 duration-300">
                <Rocket className="w-7 h-7" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">I am a Learner</span>
                <span className="text-sm font-medium text-slate-500 dark:text-[#9db8a8] leading-snug">Gain skills & find guidance</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ml-2 ${selectedRole === 'learner' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                <Check className={`w-4 h-4 text-white transition-opacity ${selectedRole === 'learner' ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
          </label>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent max-w-md mx-auto">
        <button 
          onClick={handleContinue}
          disabled={!selectedRole || isSubmitting || (selectedRole === 'mentor' && !selectedCategory)}
          className={`w-full bg-primary hover:bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-full shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group ${(!selectedRole || isSubmitting || (selectedRole === 'mentor' && !selectedCategory)) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
              <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <span>Creating Profile...</span>
              </>
          ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
          )}
        </button>
      </div>
      
    </div>
  );
}
