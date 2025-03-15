import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { detectCuisineType } from '@/lib/utils/cuisineDetector';

// Collection reference
const entriesCollection = 'entries';

export async function POST(request: Request) {
  try {
    console.log('Received request to add entry');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { restaurant, dishes, userId } = body;
    
    if (!restaurant || !dishes || !Array.isArray(dishes) || dishes.length === 0) {
      console.error('Invalid entry data:', { restaurant, dishes });
      return NextResponse.json({ 
        error: 'Invalid entry data. Restaurant and dishes are required.', 
        success: false 
      }, { status: 400 });
    }

    if (!userId) {
      console.error('Missing userId');
      return NextResponse.json({ 
        error: 'User ID is required', 
        success: false 
      }, { status: 400 });
    }
    
    // Create entry data
    const entryData = {
      userId,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      googlePlaceId: restaurant.placeId || null,
      googleMapsUrl: restaurant.url || null,
      dateVisited: new Date().toISOString(),
      dishes: dishes.map(dish => ({
        ...dish,
        id: dish.id || uuidv4()
      }))
    };
    
    console.log('Attempting to save entry to Firestore:', JSON.stringify(entryData, null, 2));
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, entriesCollection), entryData);
    
    console.log('Entry saved successfully with ID:', docRef.id);
    
    // Return the entry with the Firestore document ID
    return NextResponse.json({ 
      success: true, 
      documentId: docRef.id,
      entry: {
        ...entryData,
        id: docRef.id
      }
    });
    
  } catch (error) {
    console.error('Error adding entry:', error);
    return NextResponse.json({ 
      error: 'Failed to save entry', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
} 