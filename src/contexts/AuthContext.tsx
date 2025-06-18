"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
            // Invalid or stale cookie - remove it
            console.log('Invalid userId cookie found, removing...');
            Cookies.remove('userId');
            setUser(null);
          }
        })
        .catch((err) => {
          console.error('Error getting current user:', err);
          // Remove invalid cookie on error
          Cookies.remove('userId');
          setUser(null);
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
      setLoading(true);
      const user = await signIn(email, password);
      if (user) {
        setUser(user);
        Cookies.set('userId', user.id.toString(), { expires: 7 }); // Cookie expires in 7 days
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await signUp(email, password, name);
      setUser(user);
      Cookies.set('userId', user.id.toString(), { expires: 7 }); // Cookie expires in 7 days
    } catch (err) {
      setError('An error occurred during sign up');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setError(null);
    Cookies.remove('userId');
    // Force redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    // Don't update if updates object is empty or has no meaningful changes
    if (!updates || Object.keys(updates).length === 0) {
      return;
    }

    // Check if any of the updates are actually different from current user values
    const hasChanges = Object.entries(updates).some(([key, value]) => {
      return user[key as keyof User] !== value;
    });

    if (!hasChanges) {
      return; // No actual changes, don't make API call
    }

    const previousUser = user;
    setUser({ ...user, ...updates }); // Optimistic update

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      setUser(data.user); // Update with response from server
    } catch (err) {
      console.error('Update user error:', err);
      setUser(previousUser); // Rollback on error
    }
  }, [user]);

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
