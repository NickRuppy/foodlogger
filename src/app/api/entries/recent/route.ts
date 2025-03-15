import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Entry } from '@/lib/types';

// Collection reference
const entriesCollection = 'entries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '5');
    const userId = searchParams.get('userId');

    console.log('GET /api/entries/recent - userId:', userId, 'limitCount:', limitCount);

    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json({ 
        error: 'User ID is required', 
      }, { status: 400 });
    }
    
    // Create a query to get recent entries for the specific user
    const q = query(
      collection(db, entriesCollection),
      where("userId", "==", userId),
      orderBy("dateVisited", "desc"),
      limit(limitCount)
    );
    
    console.log('Executing Firestore query for recent entries...');
    
    // Get the documents
    const querySnapshot = await getDocs(q);
    
    // Map the documents to entries
    const entries = querySnapshot.docs.map(doc => ({
      ...(doc.data() as Omit<Entry, 'id'>),
      id: doc.id
    }));
    
    console.log(`Found ${entries.length} entries for user ${userId}`);
    
    return NextResponse.json({ 
      entries,
      success: true
    });
    
  } catch (error) {
    console.error('Error getting recent entries:', error);
    
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Check if it's a Firestore index error
      if (error.message.includes('index')) {
        console.error('This appears to be a missing index error. Please create the required index in the Firebase Console.');
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to get recent entries', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 