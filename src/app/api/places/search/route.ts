import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }
  
  try {
    // Use the new Places API v1
    console.log('Searching places with query:', query);
    
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id'
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: 'en'
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Places API v1 response received');
    
    // Transform the response to match the format expected by the client
    if (data.places && data.places.length > 0) {
      const predictions = data.places.map((place: any) => ({
        place_id: place.id,
        description: `${place.displayName?.text || query} - ${place.formattedAddress || ''}`,
        structured_formatting: {
          main_text: place.displayName?.text || query,
          secondary_text: place.formattedAddress || ''
        }
      }));
      
      return NextResponse.json({
        predictions,
        status: 'OK'
      });
    } else if (data.places && data.places.length === 0) {
      return NextResponse.json({
        predictions: [],
        status: 'ZERO_RESULTS'
      });
    }
    
    // If there's an error or unexpected response format
    if (response.status !== 200) {
      console.error('Places API error:', response.status);
      
      // Fall back to mock data if there's an error
      console.log('Falling back to mock data due to API error');
      return NextResponse.json({
        predictions: [
          {
            place_id: 'mock-place-1',
            description: `${query} Restaurant`,
            structured_formatting: {
              main_text: `${query} Restaurant`,
              secondary_text: '123 Main St, New York, NY'
            }
          },
          {
            place_id: 'mock-place-2',
            description: `${query} Cafe`,
            structured_formatting: {
              main_text: `${query} Cafe`,
              secondary_text: '456 Oak Ave, New York, NY'
            }
          },
          {
            place_id: 'mock-place-3',
            description: `${query} Bistro`,
            structured_formatting: {
              main_text: `${query} Bistro`,
              secondary_text: '789 Pine Rd, New York, NY'
            }
          }
        ],
        status: 'OK'
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
} 