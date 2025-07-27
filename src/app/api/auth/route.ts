import { NextResponse } from 'next/server';
import { userOperations, preferencesOperations } from '@/lib/csvData';

export async function POST(request: Request) {
  try {
    const { action, email, password, name } = await request.json();

    switch (action) {
      case 'signup':
        const newUser = await userOperations.createUser(email, password, name);
        return NextResponse.json({ user: newUser });

      case 'signin':
        const user = await userOperations.authenticateUser(email, password);
        if (!user) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Load user preferences
        const preferences = await preferencesOperations.getUserPreferences(user.id);
        
        // Combine user data with preferences
        const userWithPreferences = {
          ...user,
          language: preferences?.language || 'en',
          darkMode: preferences?.theme === 'dark',
          photoURL: user.photoURL || null,
        };

        return NextResponse.json({ user: userWithPreferences });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 