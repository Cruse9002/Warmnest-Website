import { NextResponse } from 'next/server';
import { userOperations } from '@/lib/csvData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userOperations.getUserById(Number(params.id));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 