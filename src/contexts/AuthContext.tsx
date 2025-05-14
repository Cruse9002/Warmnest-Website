
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string) => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('warmnest-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure default name if missing from older stored data
      if (!parsedUser.name) {
        parsedUser.name = parsedUser.email ? parsedUser.email.split('@')[0] : "User";
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { 
      id: '1', 
      email, 
      name: email.split('@')[0] || "User", // Ensure name is set
      language: 'en', 
      onboarded: false,
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches, // Default to system preference
    };
    setUser(mockUser);
    localStorage.setItem('warmnest-user', JSON.stringify(mockUser));
    setLoading(false);
    if (!mockUser.onboarded) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { 
      id: '1', 
      email, 
      name: email.split('@')[0] || "User", // Ensure name is set
      language: 'en', 
      onboarded: false,
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
    setUser(mockUser);
    localStorage.setItem('warmnest-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/onboarding');
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('warmnest-user');
    // Optionally clear theme preference from localStorage if it's app-wide and not user-specific
    // localStorage.removeItem('warmnest-theme'); 
    setLoading(false);
    router.push('/auth/login');
  };
  
  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('warmnest-user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
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
