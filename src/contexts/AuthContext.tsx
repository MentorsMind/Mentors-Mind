import { createContext, useContext, useState, useEffect } from 'react';

export interface LearningGoal {
  id: string;
  title: string;
  targetDate: string;
  category: string;
  completedSessionIds: string[];
  targetSessionCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'mentor' | 'learner';
  image?: string;
  // Mentor specific fields (optional for learners)
  company?: string;
  title?: string; // Job title
  about?: string;
  verified?: boolean;
  category?: string;
  specializations?: { name: string; price: number }[];
  phone?: string;
  state?: string;
  country?: string;
  tips?: {
    id: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
  learningGoals?: LearningGoal[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted user on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Hardcoded Demo Users
    if (email === 'sarah@techflow.com' && password === 'demo123') {
        const demoUser: User = {
            id: 'demo_sarah',
            name: 'Sarah Chen',
            email: 'sarah@techflow.com',
            role: 'mentor',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
            category: 'Tech',
            specializations: [
                { name: 'Frontend Development', price: 50 },
                { name: 'UI/UX Design', price: 45 }
            ]
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        setUser(demoUser);
        return true;
    }

    if (email === 'elena@finloop.com' && password === 'demo123') {
         const demoUser: User = {
            id: 'demo_elena',
            name: 'Elena Rodriguez',
            email: 'elena@finloop.com',
            role: 'mentor',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
            category: 'Business'
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        setUser(demoUser);
        return true;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Omit<User, 'id' | 'image'> & { password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Generate a random avatar if none provided (using DiceBear or placeholder)
    // We'll use a high-quality placeholder logic or just a color initial.
    // Let's use DiceBear for "real" feel.
    const image = `https://api.dicebear.com/7.x/notionists/svg?seed=${userData.name}`;

    const newUser = { 
      ...userData, 
      id: crypto.randomUUID(), 
      image,
      verified: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    window.location.href = '/login'; // Hard redirect to clear any state if needed
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500)); // Mock network delay

    try {
        const updatedUser = { ...user, ...updates };
        
        // Try saving to localStorage first to ensure capacity
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Also update in the main 'users' list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: User) => u.email === user.email);
        
        // If user exists in DB, update them. If not (managed/demo user), we might skip or add them.
        // For persistence of Demo users across relogin, we should probably upsert?
        // For now, standard behavior.
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
        } else {
            // If user not found (e.g. demo user), add them to the list
            users.push(updatedUser);
        }
        localStorage.setItem('users', JSON.stringify(users));

        // Only update state if storage succeeded
        setUser(updatedUser);
    } catch (error) {
        console.error("Storage operation failed", error);
        throw new Error("Failed to save changes. Your profile picture might be too large.");
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');

    await new Promise(resolve => setTimeout(resolve, 500)); // Mock network delay

    // For demo users (hardcoded)
    if (user.email === 'sarah@techflow.com' || user.email === 'elena@finloop.com') {
      // Verify current password
      if (currentPassword !== 'demo123') {
        throw new Error('Current password is incorrect');
      }
      // Demo users - we can't actually change their password in this demo
      // But we'll pretend it worked
      return;
    }

    // For regular users stored in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === user.email);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, changePassword, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
