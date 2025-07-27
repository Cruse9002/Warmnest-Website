import { NextResponse } from 'next/server';
import { userOperations, questionnaireOperations, preferencesOperations } from '@/lib/csvData';

export async function POST(request: Request) {
  try {
    const { userId, answers } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    if (!answers) {
        return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    const internalUserId = Number(userId);
    if (isNaN(internalUserId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    // Save questionnaire answers
    await questionnaireOperations.saveQuestionnaireAnswers(internalUserId, answers);
    
    // Update user onboarding status
    await userOperations.updateUser(internalUserId, { has_completed_questionnaire: true });

    // Set default user preferences based on questionnaire answers
    const defaultPreferences = {
      theme: 'light', // Default to light theme
      language: 'en', // Default to English
      notification_enabled: true,
      music_preference: 'calm',
      breathing_exercise_preference: 'box-breathing',
      focus_mode_preference: '25-5'
    };
    
    // Update theme based on favorite color if provided
    if (answers.favoriteColor) {
      const darkColors = ['black', 'purple', 'blue'];
      if (darkColors.includes(answers.favoriteColor)) {
        defaultPreferences.theme = 'dark';
      }
    }

    await preferencesOperations.updateUserPreferences(internalUserId, defaultPreferences);

    // Get updated user with preferences
    const updatedUser = await userOperations.getUserById(internalUserId);
    const preferences = await preferencesOperations.getUserPreferences(internalUserId);
    
    const userWithPreferences = {
      ...updatedUser,
      language: preferences?.language || 'en',
      darkMode: preferences?.theme === 'dark',
      photoURL: updatedUser.photoURL || null,
      onboarded: Boolean(updatedUser.has_completed_questionnaire),
    };

    return NextResponse.json({ message: 'Onboarding completed successfully', user: userWithPreferences });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 