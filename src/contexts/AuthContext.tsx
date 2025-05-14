
"use client";

import type { User, QuestionnaireAnswers } from '@/types'; // Added QuestionnaireAnswers
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUser: (updatedFields: Partial<User & QuestionnaireAnswers>) => void; // Allow QuestionnaireAnswers here
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkUserStatus = () => {
      try {
        const storedUser = localStorage.getItem('warmnest-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          if (!parsedUser.name && parsedUser.email) {
            parsedUser.name = parsedUser.email.split('@')[0] || "User";
          } else if (!parsedUser.name) {
            parsedUser.name = "User";
          }
          if (!parsedUser.photoURL) { // Ensure photoURL has a sensible default if missing
            parsedUser.photoURL = `https://placehold.co/100x100.png?text=${parsedUser.name?.[0]?.toUpperCase() || 'U'}`;
          }
          if (isMounted) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("AuthContext: Error reading from localStorage", error);
        localStorage.removeItem('warmnest-user');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUserStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const commonLoginProcedure = (mockUser: User, isNewUser: boolean) => {
    if (!mockUser.photoURL) {
      mockUser.photoURL = `https://placehold.co/100x100.png?text=${mockUser.name?.[0]?.toUpperCase() || 'U'}`;
    }
    setUser(mockUser);
    localStorage.setItem('warmnest-user', JSON.stringify(mockUser));
    setLoading(false);
    if (isNewUser || !mockUser.onboarded) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedUser = localStorage.getItem('warmnest-user');
    let existingUser: User | null = null;
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser) as User;
            if (parsed.email === email) {
                existingUser = parsed;
            }
        } catch (e) { /* ignore */ }
    }

    if (existingUser) {
      commonLoginProcedure(existingUser, false);
    } else {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0] || "User",
        language: 'en',
        onboarded: false,
        darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
        photoURL: `https://placehold.co/100x100.png?text=${(email.split('@')[0] || "U")[0].toUpperCase()}`,
      };
      commonLoginProcedure(mockUser, true);
    }
  };

  const register = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0] || "User",
      language: 'en',
      onboarded: false,
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
      photoURL: `https://placehold.co/100x100.png?text=${(email.split('@')[0] || "U")[0].toUpperCase()}`,
    };
    commonLoginProcedure(mockUser, true);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const randomId = Math.floor(Math.random() * 10000);
    const googleEmail = `google.user.${randomId}@example.com`;
    const nameFromEmail = googleEmail.split('@')[0].replace(/\./g, ' ');
    const formattedName = nameFromEmail.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    const mockUser: User = {
      id: `google-${Date.now()}`,
      email: googleEmail,
      name: formattedName,
      language: 'en',
      onboarded: false,
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
      photoURL: `https://placehold.co/100x100.png?text=${formattedName?.[0]?.toUpperCase() || 'G'}`,
    };
    commonLoginProcedure(mockUser, true);
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('warmnest-user');
    localStorage.removeItem('warmnest-journal');
    localStorage.removeItem('warmnest-moodlog');
    localStorage.removeItem('warmnest-theme');
    localStorage.removeItem('warmnest-onboarding-answers');
    setLoading(false);
    router.push('/auth/login');
  };

  const updateUser = (updatedFields: Partial<User & QuestionnaireAnswers>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('warmnest-user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const deleteAccount = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, signInWithGoogle, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
