import { NextResponse } from 'next/server';
import { userOperations, questionnaireOperations } from '@/lib/csvData';

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

    await questionnaireOperations.saveQuestionnaireAnswers(internalUserId, answers);
    await userOperations.updateUser(internalUserId, { has_completed_questionnaire: true });

    const updatedUser = await userOperations.getUserById(internalUserId);

    return NextResponse.json({ message: 'Onboarding completed successfully', user: updatedUser });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 