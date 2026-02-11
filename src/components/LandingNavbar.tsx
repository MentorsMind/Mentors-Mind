import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, User, Settings, LogOut, Bell, Wallet, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import logo from '../assets/logo.png';

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationCount = unreadCount;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050B0A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="Bentechnology" className="h-10 w-auto object-contain" />
              <span className="text-2xl font-bold tracking-tight hidden md:block font-google text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                MentorMinds
              </span>
            </button>

            {/* Mobile Centered Logo Text */}
            <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
              <span 
                className="text-xl font-bold tracking-tight font-google text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 cursor-pointer" 
                onClick={() => navigate('/')}
              >
                MentorMinds
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                   {/* Notifications */}
                   <button 
                     onClick={() => navigate('/notifications')}
                     className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
                   >
                     <Bell className="w-5 h-5 text-gray-300" />
                     {notificationCount > 0 && (
                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#050B0A]">
                         {notificationCount}
                       </span>
                     )}
                   </button>

                   {/* User Dropdown */}
                   <div className="relative" ref={dropdownRef}>
                     <button
                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                       className="flex items-center gap-3 pl-4 border-l border-white/10 hover:bg-white/5 px-3 py-2 rounded-xl transition-colors"
                     >
                       <div 
                         className="w-9 h-9 rounded-full bg-cover bg-center ring-2 ring-emerald-500/50" 
                         style={{ backgroundImage: `url('${user.image}')` }}
                       ></div>
                       <div className="text-left">
                           <p className="text-sm font-semibold text-white leading-none">{user.name.split(' ')[0]}</p>
                           <p className="text-xs text-emerald-400 capitalize pt-0.5">{user.role}</p>
                       </div>
                       <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>

                     {/* Dropdown Menu */}
                     {isDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-64 bg-[#0F1615] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                         {/* User Info Header */}
                         <div className="p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                           <div className="flex items-center gap-3">
                             <div 
                               className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-emerald-500/50" 
                               style={{ backgroundImage: `url('${user.image}')` }}
                             ></div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-white truncate">{user.name}</p>
                               <p className="text-xs text-gray-400 truncate">{user.email}</p>
                               <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full capitalize">
                                 {user.role}
                               </span>
                             </div>
                           </div>
                         </div>

                         {/* Menu Items */}
                         <div className="p-2">
                           <button
                             onClick={() => {
                               setIsDropdownOpen(false);
                               navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/learner-dashboard');
                             }}
                             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left"
                           >
                             <LayoutDashboard className="w-5 h-5" />
                             <span className="text-sm font-medium">Dashboard</span>
                           </button>

                           {user.role === 'mentor' && (
                             <button
                               onClick={() => {
                                 setIsDropdownOpen(false);
                                 navigate('/mentor/wallet');
                               }}
                               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left"
                             >
                               <Wallet className="w-5 h-5" />
                               <div className="flex-1 flex items-center justify-between">
                                 <span className="text-sm font-medium">My Wallet</span>
                                 <span className="text-xs text-emerald-400 font-semibold">₦125k</span>
                               </div>
                             </button>
                           )}

                           <button
                             onClick={() => {
                               setIsDropdownOpen(false);
                               navigate(user.role === 'mentor' ? `/mentor/${user.id}` : `/learner/${user.id}`);
                             }}
                             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left"
                           >
                             <User className="w-5 h-5" />
                             <span className="text-sm font-medium">My Profile</span>
                           </button>

                           <button
                             onClick={() => {
                               setIsDropdownOpen(false);
                               navigate('/settings');
                             }}
                             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left"
                           >
                             <Settings className="w-5 h-5" />
                             <span className="text-sm font-medium">Settings</span>
                           </button>

                           <div className="my-2 border-t border-white/10"></div>

                           <button
                             onClick={() => {
                               setIsDropdownOpen(false);
                               logout();
                             }}
                             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-colors text-left"
                           >
                             <LogOut className="w-5 h-5" />
                             <span className="text-sm font-medium">Log Out</span>
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                    <button 
                      onClick={() => navigate('/signup')}
                      className="px-6 py-2.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-red-700 font-black text-sm transition-all shadow-lg shadow-yellow-500/20 tracking-wide border-2 border-transparent uppercase"
                    >
                      GET STARTED
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all tracking-wide"
                    >
                      SIGN IN
                    </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors relative"
            >
              {user && notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#050B0A]">
                  {notificationCount}
                </span>
              )}
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#050B0A] absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
             <div className="p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              
              <div className="pt-2 border-t border-white/5 space-y-3">
                {user ? (
                  <>
                     {/* User Info Card */}
                     <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-white/10">
                        <div 
                          className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-emerald-500/50" 
                          style={{ backgroundImage: `url('${user.image}')` }}
                        ></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full capitalize">
                              {user.role}
                            </span>
                        </div>
                        {notificationCount > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-500 rounded-full">
                            <Bell className="w-3 h-3 text-white" />
                            <span className="text-xs font-bold text-white">{notificationCount}</span>
                          </div>
                        )}
                     </div>

                     {/* Menu Buttons */}
                     <button 
                       onClick={() => {
                         setIsMenuOpen(false);
                         navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/learner-dashboard');
                       }}
                       className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-colors flex items-center justify-center gap-2"
                     >
                       <LayoutDashboard className="w-5 h-5" />
                       Go to Dashboard
                     </button>

                     {user.role === 'mentor' && (
                       <button 
                         onClick={() => {
                           setIsMenuOpen(false);
                           navigate('/mentor/wallet');
                         }}
                         className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 text-white font-semibold border border-emerald-500/30 transition-colors flex items-center justify-between"
                       >
                         <div className="flex items-center gap-2">
                           <Wallet className="w-5 h-5" />
                           <span>My Wallet</span>
                         </div>
                         <span className="text-sm text-emerald-400 font-bold">₦125k</span>
                       </button>
                     )}

                     <button 
                       onClick={() => {
                         setIsMenuOpen(false);
                         navigate(user.role === 'mentor' ? `/mentor/${user.id}` : `/learner/${user.id}`);
                       }}
                       className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors flex items-center gap-2"
                     >
                       <User className="w-5 h-5" />
                       My Profile
                     </button>

                     <button 
                       onClick={() => {
                         setIsMenuOpen(false);
                         navigate('/settings');
                       }}
                       className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors flex items-center gap-2"
                     >
                       <Settings className="w-5 h-5" />
                       Settings
                     </button>

                     <button 
                       onClick={() => {
                         setIsMenuOpen(false);
                         logout();
                       }}
                       className="w-full px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold border border-red-500/30 transition-colors flex items-center gap-2"
                     >
                       <LogOut className="w-5 h-5" />
                       Log Out
                     </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/signup')}
                      className="w-full px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-red-700 font-black transition-all shadow-lg shadow-yellow-500/20 tracking-wide mb-4 text-center"
                    >
                      GET STARTED
                    </button>
                    <button 
                       onClick={() => {
                         setIsMenuOpen(false);
                         navigate('/login');
                       }}
                       className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-900/20"
                    >
                       SIGN IN
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
    </nav>
  );
}
