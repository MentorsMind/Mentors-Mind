
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  MessageCircle,
  Settings,
  Bell,
  Menu,
  X,
  Wallet,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, path, isActive, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-current group-hover:scale-110 transition-transform'}`} />
      <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon: Icon, label, isActive, onClick }: Omit<NavItemProps, 'path'>) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
            <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                {isActive && label === 'Forum' && (
                     <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0e1612]"></span>
                )}
            </div>
            <span className={`text-[9px] font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    )
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Landing Page', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: user?.role === 'mentor' ? '/mentor-dashboard' : '/learner-dashboard' },
    ...(user?.role === 'mentor' ? [{ icon: Wallet, label: 'Wallet', path: '/mentor/wallet' }] : []),
    { icon: Users, label: 'Mentors', path: '/mentorship-hub' },
    { icon: MessageCircle, label: 'Forum', path: '/forum' },
    { icon: User, label: 'Profile', path: user ? (user.role?.toLowerCase() === 'mentor' ? `/mentor/${user.id}` : `/learner/${user.id}`) : '/login' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-[#1a2e22] border-r border-slate-200 dark:border-white/5 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src={logo} alt="Bentechnology" className="h-12 w-auto object-contain animate-[spin_10s_linear_infinite]" />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem 
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-auto flex flex-col gap-3">
        {user && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/5">
                <div 
                    className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-[#1a2e22]" 
                    style={{ backgroundImage: `url('${user.image}')` }}
                ></div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">{user.role} Account</span>
                </div>
            </div>
        )}

        <button 
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: user?.role === 'mentor' ? '/mentor-dashboard' : '/learner-dashboard' },
    { icon: Users, label: 'Mentors', path: '/mentorship-hub' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Account', path: user ? (user.role?.toLowerCase() === 'mentor' ? `/mentor/${user.id}` : `/learner/${user.id}`) : '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 z-50 w-full bg-white dark:bg-[#1a2e22] border-t border-slate-200 dark:border-white/5 pb-safe pt-2">
        <div className="flex justify-around items-center h-16 px-1">
            {navItems.map((item) => (
                <MobileNavItem
                    key={item.path}
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
