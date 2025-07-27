import { NextResponse } from 'next/server';
import { userOperations, preferencesOperations } from '@/lib/csvData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await userOperations.getUserById(Number(id));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Load user preferences
    const preferences = await preferencesOperations.getUserPreferences(Number(id));
    
    // Combine user data with preferences
    const userWithPreferences = {
      ...user,
      language: preferences?.language || 'en',
      darkMode: preferences?.theme === 'dark',
      photoURL: user.photoURL || null,
      onboarded: Boolean(user.has_completed_questionnaire),
    };

    return NextResponse.json({ user: userWithPreferences });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if request body is empty
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }
    
    // Try to parse the body, but handle empty bodies gracefully
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        // Return current user data if body is empty
        const user = await userOperations.getUserById(Number(id));
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        const preferences = await preferencesOperations.getUserPreferences(Number(id));
        const userWithPreferences = {
          ...user,
          language: preferences?.language || 'en',
          darkMode: preferences?.theme === 'dark',
          photoURL: user.photoURL || null,
          onboarded: Boolean(user.has_completed_questionnaire),
        };
        
        return NextResponse.json({ user: userWithPreferences });
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Check if body has any meaningful updates
    if (!body || Object.keys(body).length === 0) {
      // Return current user data if no updates provided
      const user = await userOperations.getUserById(Number(id));
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const preferences = await preferencesOperations.getUserPreferences(Number(id));
      const userWithPreferences = {
        ...user,
        language: preferences?.language || 'en',
        darkMode: preferences?.theme === 'dark',
        photoURL: user.photoURL || null,
        onboarded: Boolean(user.has_completed_questionnaire),
      };
      
      return NextResponse.json({ user: userWithPreferences });
    }
    
    // Separate user updates from preference updates
    const { language, darkMode, ...userUpdates } = body;
    
    // Update user data
    const updatedUser = await userOperations.updateUser(Number(id), userUpdates);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update preferences if provided
    if (language !== undefined || darkMode !== undefined) {
      const preferenceUpdates: any = {};
      if (language !== undefined) preferenceUpdates.language = language;
      if (darkMode !== undefined) preferenceUpdates.theme = darkMode ? 'dark' : 'light';
      
      await preferencesOperations.updateUserPreferences(Number(id), preferenceUpdates);
    }

    // Load updated user with preferences
    const preferences = await preferencesOperations.getUserPreferences(Number(id));
    const userWithPreferences = {
      ...updatedUser,
      language: preferences?.language || 'en',
      darkMode: preferences?.theme === 'dark',
      photoURL: updatedUser.photoURL || null,
      onboarded: Boolean(updatedUser.has_completed_questionnaire),
    };

    return NextResponse.json({ user: userWithPreferences });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 