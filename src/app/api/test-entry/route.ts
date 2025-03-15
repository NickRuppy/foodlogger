import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // Create a simple test entry
    const entryData = {
      id: uuidv4(),
      restaurantName: "Test Restaurant",
      restaurantAddress: "123 Test Street, Test City",
      googlePlaceId: "test-place-id",
      googleMapsUrl: "https://maps.google.com",
      dateVisited: new Date().toISOString(),
      dishes: [
        {
          id: uuidv4(),
          name: "Test Dish",
          overallRating: 8,
          priceValueRating: 7,
          tasteRating: 9,
          vibeRating: 8,
          comments: "This is a test dish"
        }
      ]
    };
    
    console.log('Attempting to save test entry to Firestore:', JSON.stringify(entryData, null, 2));
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'entries'), entryData);
    
    console.log('Test entry saved successfully with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true, 
      documentId: docRef.id,
      entry: entryData
    });
    
  } catch (error) {
    console.error('Error adding test entry:', error);
    return NextResponse.json({ 
      error: 'Failed to save test entry', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 