import { createContext, useContext, useState, useEffect } from "react";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { get, getSync, remove, set } from "../lib/storage";
import { STORAGE_KEYS } from "../lib/storageKeys";

export interface LearningGoal {
  id: string;
  title: string;
  targetDate: string;
  category: string;
  completedSessionIds: string[];
  targetSessionCount?: number;
}

export interface NotificationPreferences {
  booking: boolean;
  message: boolean;
  reply: boolean;
  system: boolean;
  consultation: boolean;
  pushEnabled: boolean;
}

export interface ReferralReward {
  userId: string;
  sessionId: string;
  rewardedAt: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "mentor" | "learner";
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
  notificationPreferences?: NotificationPreferences;
  onboardingCompleted?: boolean;
  // Referral system
  referralCode?: string;
  referredBy?: string; // referrer's user ID
  referralRewards?: ReferralReward[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface StoredUser extends User {
  passwordHash: string;
  passwordSalt: string;
}

function loadUsers(): StoredUser[] {
  return getSync<StoredUser[]>(STORAGE_KEYS.USERS) ?? [];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = await get<User>(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    void initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      email === "sarah@techflow.com" &&
      (await verifyPassword(
        password,
        "25952f708acea6a47fa51627cf386341c47a76d406e8d7d0413ce4afac72a27f",
        "cfab91c2c7087830eb7be34d4273b7c2",
      ))
    ) {
      const demoUser: User = {
        id: "demo_sarah",
        name: "Sarah Chen",
        email: "sarah@techflow.com",
        role: "mentor",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Tech",
        specializations: [
          { name: "Frontend Development", price: 50 },
          { name: "UI/UX Design", price: 45 },
        ],
      };
      await set(STORAGE_KEYS.CURRENT_USER, demoUser);
      setUser(demoUser);
      return true;
    }

    if (
      email === "elena@finloop.com" &&
      (await verifyPassword(
        password,
        "c6ffbc1ca62c4283a4c7e172acf8e40e055deaa01261e6e9fc8e7a9147c7014b",
        "b225d90dd22f479c5b45f361a097e724",
      ))
    ) {
      const demoUser: User = {
        id: "demo_elena",
        name: "Elena Rodriguez",
        email: "elena@finloop.com",
        role: "mentor",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Business",
      };
      await set(STORAGE_KEYS.CURRENT_USER, demoUser);
      setUser(demoUser);
      return true;
    }

    const users = loadUsers();
    const foundUser = users.find((u) => u.email === email);

    if (
      foundUser &&
      (await verifyPassword(
        password,
        foundUser.passwordHash,
        foundUser.passwordSalt,
      ))
    ) {
      const { passwordHash: _, passwordSalt: __, ...safeUser } = foundUser;
      setUser(safeUser);
      await set(STORAGE_KEYS.CURRENT_USER, safeUser);
      return true;
    }
    return false;
  };

  const signup = async (
    userData: Omit<User, "id" | "image"> & { password: string },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = loadUsers();

    const { hash: _, salt: __ } = await hashPassword(userData.password);

    const image = `https://api.dicebear.com/7.x/notionists/svg?seed=${userData.name}`;

    const generateReferralCode = () =>
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    let referralCode = generateReferralCode();
    while (users.some((u: StoredUser) => u.referralCode === referralCode)) {
      referralCode = generateReferralCode();
    }

    const newUser = {
      ...userData,
      id: crypto.randomUUID(),
      image,
      verified: false,
      referralCode,
      referralRewards: [],
    };

    users.push(newUser);
    await set(STORAGE_KEYS.USERS, users);

    const { passwordHash: _, passwordSalt: __, ...safeUser } = newUser;
    setUser(safeUser);
    await set(STORAGE_KEYS.CURRENT_USER, safeUser);
  };

  const logout = () => {
    setUser(null);
    void remove(STORAGE_KEYS.CURRENT_USER);
    window.location.href = "/login";
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const updatedUser = { ...user, ...updates };

      await set(STORAGE_KEYS.CURRENT_USER, updatedUser);

      const users = loadUsers();
      const userIndex = users.findIndex((u) => u.email === user.email);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
      } else {
        const storedUserData: StoredUser = {
          ...updatedUser,
          passwordHash: "",
          passwordSalt: "",
        };
        users.push(storedUserData);
      }
      await set(STORAGE_KEYS.USERS, users);

      setUser(updatedUser);
    } catch (error) {
      console.error("Storage operation failed", error);
      throw new Error(
        "Failed to save changes. Your profile picture might be too large.",
      );
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) throw new Error("No user logged in");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      user.email === "sarah@techflow.com" ||
      user.email === "elena@finloop.com"
    ) {
      const isCorrect =
        user.email === "sarah@techflow.com"
          ? await verifyPassword(
            currentPassword,
            "25952f708acea6a47fa51627cf386341c47a76d406e8d7d0413ce4afac72a27f",
            "cfab91c2c7087830eb7be34d4273b7c2",
          )
          : await verifyPassword(
            currentPassword,
            "c6ffbc1ca62c4283a4c7e172acf8e40e055deaa01261e6e9fc8e7a9147c7014b",
            "b225d90dd22f479c5b45f361a097e724",
          );
      if (!isCorrect) {
        throw new Error("Current password is incorrect");
      }
      return;
    }

    const users = loadUsers();
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const isCorrect = await verifyPassword(
      currentPassword,
      users[userIndex].passwordHash,
      users[userIndex].passwordSalt,
    );
    if (!isCorrect) {
      throw new Error("Current password is incorrect");
    }

    const { hash, salt } = await hashPassword(newPassword);
    users[userIndex].passwordHash = hash;
    users[userIndex].passwordSalt = salt;
    await set(STORAGE_KEYS.USERS, users);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
