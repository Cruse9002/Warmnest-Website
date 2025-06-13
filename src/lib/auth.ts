import type { User } from '@/types';

export async function signUp(email: string, password: string, name: string): Promise<User> {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'signup',
      email,
      password,
      name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign up');
  }

  const { user } = await response.json();
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    language: (user.language as any) || 'en',
    onboarded: (user.onboarded as any) ?? false,
    darkMode: (user.darkMode as any),
    photoURL: (user.photoURL as any),
  } as User;
}

export async function signIn(email: string, password: string): Promise<User | null> {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'signin',
      email,
      password,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign in');
  }

  const { user } = await response.json();
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    language: (user.language as any) || 'en',
    onboarded: (user.onboarded as any) ?? false,
    darkMode: (user.darkMode as any),
    photoURL: (user.photoURL as any),
  } as User;
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      return null;
    }
    const { user } = await response.json();
    return {
      id: String(user.id),
      email: user.email,
      name: user.name,
      language: (user.language as any) || 'en',
      onboarded: (user.onboarded as any) ?? false,
      darkMode: (user.darkMode as any),
      photoURL: (user.photoURL as any),
    } as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 