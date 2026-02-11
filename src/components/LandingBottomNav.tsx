import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Stethoscope, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileNavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function MobileNavItem({ icon: Icon, label, isActive, onClick }: MobileNavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
        isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <div className="relative">
        <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
      </div>
      <span className={`text-[9px] font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
}

export function LandingBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Mentors', path: '/mentorship-hub' },
    { icon: Stethoscope, label: 'Medical', path: '/medical' },
    { icon: MessageCircle, label: 'Forum', path: '/forum' },
    { 
      icon: User, 
      label: user ? 'Account' : 'Sign In', 
      path: user 
        ? (user.role?.toLowerCase() === 'mentor' ? `/mentor/${user.id}` : `/learner/${user.id}`) 
        : '/login' 
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 z-50 w-full bg-[#0e1612]/95 backdrop-blur-md border-t border-white/10 pb-safe pt-2">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item, index) => (
          <MobileNavItem
            key={index}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}
