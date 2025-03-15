import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
  }
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }
  
  try {
    console.log('Getting details for place:', placeId);
    
    // Use the Places Details API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,url&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Place details API response received');
    
    if (data.result) {
      return NextResponse.json(data);
    }
    
    // If there's an error or unexpected response format
    if (response.status !== 200) {
      console.error('Place details API error:', response.status);
      
      // Fall back to mock data if there's an error
      console.log('Falling back to mock data due to API error');
      return NextResponse.json({
        result: {
          name: 'Mock Restaurant',
          formatted_address: '123 Mock Street, Mock City',
          url: 'https://maps.google.com/?cid=12345'
        },
        status: 'OK'
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
} 