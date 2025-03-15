import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface CollectionResult {
  exists: boolean;
  documentCount?: number;
  documents?: Array<{id: string, data: any}>;
  error?: string;
}

interface CollectionsResults {
  [key: string]: CollectionResult;
}

export async function GET() {
  try {
    // Try to get all collections
    const collections = ['test', 'entries', 'challenges'];
    const results: CollectionsResults = {};
    
    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        results[collectionName] = {
          exists: true,
          documentCount: querySnapshot.docs.length,
          documents: querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        };
      } catch (error) {
        results[collectionName] = {
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      collections: results
    });
    
  } catch (error) {
    console.error('Error checking collections:', error);
    return NextResponse.json({ 
      error: 'Failed to check collections', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 