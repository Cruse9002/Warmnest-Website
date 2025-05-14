
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) // Simplified login
    => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string) // Simplified register
    => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mock loading user from localStorage
    const storedUser = localStorage.getItem('warmth-within-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: '1', email, name: email.split('@')[0], language: 'en', onboarded: false };
    setUser(mockUser);
    localStorage.setItem('warmth-within-user', JSON.stringify(mockUser));
    setLoading(false);
    if (!mockUser.onboarded) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (email: string) => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: '1', email, name: email.split('@')[0], language: 'en', onboarded: false };
    setUser(mockUser);
    localStorage.setItem('warmth-within-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/onboarding');
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('warmth-within-user');
    setLoading(false);
    router.push('/auth/login');
  };
  
  // Function to update user, e.g., after onboarding or language change
  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('warmth-within-user', JSON.stringify(newUser));
      return newUser;
    });
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType & { updateUser: (updatedFields: Partial<User>) => void } => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Re-asserting updateUser in the return type for direct access via useAuth()
  return context as AuthContextType & { updateUser: (updatedFields: Partial<User>) => void };
};
