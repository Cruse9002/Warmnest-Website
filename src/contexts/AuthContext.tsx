"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, getCurrentUser } from '@/lib/auth';
import type { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  login: (email: string) => Promise<void>;
  register: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const userId = Cookies.get('userId');
    if (userId) {
      getCurrentUser(userId)
        .then((user) => {
          if (user) {
            setUser(user);
          } else {
            Cookies.remove('userId');
          }
        })
        .catch((err) => {
          console.error('Error getting current user:', err);
          Cookies.remove('userId');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await signIn(email, password);
      if (user) {
        setUser(user);
        Cookies.set('userId', user.id, { expires: 7 }); // Cookie expires in 7 days
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', err);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const user = await signUp(email, password, name);
      setUser(user);
      Cookies.set('userId', user.id, { expires: 7 }); // Cookie expires in 7 days
    } catch (err) {
      setError('An error occurred during sign up');
      console.error('Sign up error:', err);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    Cookies.remove('userId');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateUser,
        login: async (email: string) => {
          console.warn('login(email) is deprecated; use signIn(email, password) instead.');
          await handleSignIn(email, '');
        },
        register: async (email: string) => {
          console.warn('register(email) is deprecated; use signUp(email, password, name) instead.');
        },
        logout: async () => {
          handleSignOut();
        },
        signInWithGoogle: async () => {
          console.warn('signInWithGoogle is not implemented.');
        },
        deleteAccount: async () => {
          console.warn('deleteAccount is not implemented.');
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
