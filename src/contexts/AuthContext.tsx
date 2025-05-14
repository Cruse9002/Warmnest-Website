
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
  signInWithGoogle: () => Promise<void>; // Added for Google Sign-In
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    // console.log("AuthContext: useEffect for localStorage check triggered.");
    let isMounted = true;
    const checkUserStatus = () => {
      try {
        const storedUser = localStorage.getItem('warmnest-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          // Ensure default name if missing from older stored data or for robustness
          if (!parsedUser.name && parsedUser.email) {
            parsedUser.name = parsedUser.email.split('@')[0] || "User";
          } else if (!parsedUser.name) {
            parsedUser.name = "User";
          }
          if (isMounted) {
            setUser(parsedUser);
            // console.log("AuthContext: User loaded from localStorage", parsedUser);
          }
        } else {
          // console.log("AuthContext: No user in localStorage.");
        }
      } catch (error) {
        console.error("AuthContext: Error reading from localStorage", error);
        // Potentially clear corrupt storage
        localStorage.removeItem('warmnest-user');
      } finally {
        if (isMounted) {
          setLoading(false);
          // console.log("AuthContext: Loading finished.");
        }
      }
    };

    checkUserStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const commonLoginProcedure = (mockUser: User, isNewUser: boolean) => {
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
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    // In a real app, you'd fetch the user. Here we assume any login attempt could be a new user
    // or an existing one. For simplicity, we'll treat it like finding an existing user.
    // If user doesn't exist in a real backend, this would fail.
    // For this mock, we retrieve or create.
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
      // If not found, create a basic user profile (as if it's a first-time login for this email)
      // This differs from register as register *always* implies new.
      // Login implies user might exist or it's a first-time use of an email.
      const mockUser: User = { 
        id: '1', // Mock ID
        email, 
        name: email.split('@')[0] || "User",
        language: 'en', 
        onboarded: false, // Assume not onboarded if we "create" them on login
        darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
      };
      commonLoginProcedure(mockUser, true);
    }
  };

  const register = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { 
      id: `user-${Date.now()}`, // More unique mock ID
      email, 
      name: email.split('@')[0] || "User",
      language: 'en', 
      onboarded: false,
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
    };
    commonLoginProcedure(mockUser, true);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // Mock Google email and name derivation
    const randomId = Math.floor(Math.random() * 10000);
    const googleEmail = `google.user.${randomId}@example.com`;
    const nameFromEmail = googleEmail.split('@')[0].replace(/\./g, ' '); // "google user 123"
    const formattedName = nameFromEmail.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); // "Google User 123"

    const mockUser: User = {
      id: `google-${Date.now()}`,
      email: googleEmail,
      name: formattedName,
      language: 'en', 
      onboarded: false, 
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
    };
    commonLoginProcedure(mockUser, true); // Google sign-in implies a new or returning user, route to onboarding
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    // Clear all app-related localStorage items
    localStorage.removeItem('warmnest-user');
    localStorage.removeItem('warmnest-journal');
    localStorage.removeItem('warmnest-moodlog');
    localStorage.removeItem('warmnest-theme');
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
    <AuthContext.Provider value={{ user, loading, login, logout, register, signInWithGoogle, updateUser }}>
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
