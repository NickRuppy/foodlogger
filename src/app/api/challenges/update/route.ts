import { NextResponse } from 'next/server';
import { updateChallengesFromEntry } from '@/lib/firebase/mealService';

export async function POST(request: Request) {
  try {
    const { entry } = await request.json();
    
    if (!entry || !entry.userId) {
      return NextResponse.json({ 
        error: 'Missing entry data or userId', 
        success: false 
      }, { status: 400 });
    }
    
    // Update challenges based on the new entry
    await updateChallengesFromEntry(entry, entry.userId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Challenges updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating challenges:', error);
    return NextResponse.json({ 
      error: 'Failed to update challenges', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 