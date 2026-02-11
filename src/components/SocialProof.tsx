import { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Users } from 'lucide-react';

interface RecentUser {
  name: string;
  location: string;
  time: string;
}

export function SocialProof() {
  const [recentUsers] = useState<RecentUser[]>([
    { name: 'Sarah Chen', location: 'Lagos', time: '2 min ago' },
    { name: 'Michael Obi', location: 'Abuja', time: '5 min ago' },
    { name: 'Amara Eze', location: 'Port Harcourt', time: '8 min ago' },
  ]);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentUserIndex((prev) => (prev + 1) % recentUsers.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [recentUsers.length]);

  const currentUser = recentUsers[currentUserIndex];

  return (
    <div className="space-y-4">
      {/* Recent Activity */}
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              <span className="font-bold">{currentUser.name}</span> from {currentUser.location}
            </p>
            <p className="text-white/60 text-xs">{currentUser.time}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white text-xs font-bold">SSL Secure</p>
            <p className="text-white/60 text-[10px]">256-bit</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-white text-xs font-bold">Verified</p>
            <p className="text-white/60 text-[10px]">Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
