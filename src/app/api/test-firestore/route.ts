import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    // Try to add a simple test document
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Test document',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      documentId: docRef.id,
      message: 'Test document created successfully'
    });
    
  } catch (error) {
    console.error('Error testing Firestore:', error);
    return NextResponse.json({ 
      error: 'Failed to write to Firestore', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 