
"use client";

import type { User, QuestionnaireAnswers } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUser: (updatedFields: Partial<User & QuestionnaireAnswers>) => void; 
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
          if (!parsedUser.photoURL) { 
            // URL_PLACEHOLDER: Default placeholder for user photo if not set.
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
      // URL_PLACEHOLDER: Default placeholder for new user photo.
      mockUser.photoURL = `https://placehold.co/100x100.png?text=${mockUser.name?.[0]?.toUpperCase() || 'U'}`;
    }
    setUser(mockUser);
    localStorage.setItem('warmnest-user', JSON.stringify(mockUser));
    setLoading(false);
    if (isNewUser || !mockUser.onboarded) {
      // URL_NAVIGATION: Redirect to onboarding for new/unonboarded users.
      router.push('/onboarding');
    } else {
      // URL_NAVIGATION: Redirect to dashboard for onboarded users.
      router.push('/dashboard');
    }
  };

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
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
      // For demo, creating a user if not found - real app would likely error or have different flow
      const mockUser: User = {
        id: '1', // Mock ID
        email,
        name: email.split('@')[0] || "User",
        language: 'en',
        onboarded: false,
        darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
        // URL_PLACEHOLDER: Default photoURL for a newly created user during login (if not found).
        photoURL: `https://placehold.co/100x100.png?text=${(email.split('@')[0] || "U")[0].toUpperCase()}`,
      };
      commonLoginProcedure(mockUser, true);
    }
  };

  const register = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const mockUser: User = {
      id: `user-${Date.now()}`, // Mock ID
      email,
      name: email.split('@')[0] || "User",
      language: 'en',
      onboarded: false,
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
      // URL_PLACEHOLDER: Default photoURL for a newly registered user.
      photoURL: `https://placehold.co/100x100.png?text=${(email.split('@')[0] || "U")[0].toUpperCase()}`,
    };
    commonLoginProcedure(mockUser, true);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const randomId = Math.floor(Math.random() * 10000);
    const googleEmail = `google.user.${randomId}@example.com`;
    const nameFromEmail = googleEmail.split('@')[0].replace(/\./g, ' ');
    const formattedName = nameFromEmail.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    const mockUser: User = {
      id: `google-${Date.now()}`, // Mock ID
      email: googleEmail,
      name: formattedName,
      language: 'en',
      onboarded: false,
      darkMode: typeof window !== "undefined" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : false,
      // URL_PLACEHOLDER: Default photoURL for Google sign-in user.
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
    // Clear any per-exercise skip instruction flags
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('warmnest-skip-breathing-instructions-')) {
        localStorage.removeItem(key);
      }
    });
    setLoading(false);
    // URL_NAVIGATION: Redirect to login page after logout.
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
    // In a real app, this would involve backend calls to delete user data.
    // For mock, it's the same as logout.
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
