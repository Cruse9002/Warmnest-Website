import { NextRequest, NextResponse } from 'next/server';
import { taskAssessmentOperations } from '@/lib/csvData';

export async function POST(request: NextRequest) {
  try {
    const { userId, assessment } = await request.json();

    if (!userId || !assessment) {
      return NextResponse.json(
        { error: 'User ID and assessment data are required' },
        { status: 400 }
      );
    }

    const savedAssessment = await taskAssessmentOperations.saveTaskAssessment(userId, assessment);

    return NextResponse.json({
      success: true,
      assessment: savedAssessment,
    });
  } catch (error) {
    console.error('Task assessment submission error:', error);
    return NextResponse.json(
      { error: 'Failed to save task assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const assessments = await taskAssessmentOperations.getTaskAssessments(Number(userId));

    return NextResponse.json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error('Task assessment retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve task assessments' },
      { status: 500 }
    );
  }
} 