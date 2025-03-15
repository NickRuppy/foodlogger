import { Restaurant } from './types';

/**
 * Search for places using Google Places API
 */
export async function searchPlaces(query: string): Promise<Restaurant[]> {
  console.log('Searching places with query:', query);
  
  try {
    // Use our server-side API route
    const response = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Places API response:', data);
    
    if (data.error) {
      console.error('Places API error:', data.error);
      return [];
    }
    
    if (!data.predictions || data.predictions.length === 0) {
      return [];
    }
    
    // Convert predictions to Restaurant objects
    const restaurants: Restaurant[] = await Promise.all(
      data.predictions.map(async (prediction: any) => {
        // For performance, we'll only fetch details when a restaurant is selected
        return {
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: prediction.structured_formatting?.secondary_text || '',
          placeId: prediction.place_id
        };
      })
    );
    
    return restaurants;
  } catch (error) {
    console.error('Error fetching places:', error);
    
    // Fallback to mock data if API call fails
    console.log('Falling back to mock data');
    return [
      {
        name: "Joe's Pizza",
        address: "123 Main St, New York, NY",
        placeId: "mock-place-1",
      },
      {
        name: "Taste of India",
        address: "456 Oak Ave, New York, NY",
        placeId: "mock-place-2",
      },
      {
        name: "Sushi Express",
        address: "789 Pine Rd, New York, NY",
        placeId: "mock-place-3",
      }
    ].filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) || 
      place.address.toLowerCase().includes(query.toLowerCase())
    );
  }
}

/**
 * Get details of a place using its place_id
 */
export async function getPlaceDetails(placeId: string): Promise<Restaurant | null> {
  console.log('Getting details for place:', placeId);
  
  try {
    // Use our server-side API route
    const response = await fetch(`/api/places/details?placeId=${placeId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Place details response:', data);
    
    if (data.error) {
      console.error('Place details API error:', data.error);
      return null;
    }
    
    return {
      name: data.result.name,
      address: data.result.formatted_address,
      placeId: placeId,
      url: data.result.url
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    
    // Fallback to mock data if API call fails
    const mockPlaces: Record<string, Restaurant> = {
      'mock-place-1': {
        name: "Joe's Pizza",
        address: "123 Main St, New York, NY",
        placeId: "mock-place-1",
        url: "https://maps.google.com/?cid=12345",
      },
      'mock-place-2': {
        name: "Taste of India",
        address: "456 Oak Ave, New York, NY",
        placeId: "mock-place-2",
        url: "https://maps.google.com/?cid=67890",
      },
      'mock-place-3': {
        name: "Sushi Express",
        address: "789 Pine Rd, New York, NY",
        placeId: "mock-place-3",
        url: "https://maps.google.com/?cid=54321",
      }
    };
    
    return mockPlaces[placeId] || null;
  }
}

/**
 * Detect cuisine type based on restaurant name and address
 * This is a simple placeholder that would be replaced with better logic or API
 */
export function detectCuisineType(restaurantName: string, restaurantAddress: string): string[] {
  const name = restaurantName.toLowerCase();
  const possibleCuisines: [string, string[]][] = [
    ['italian', ['pizza', 'pasta', 'italian', 'trattoria', 'pizzeria']],
    ['mexican', ['taco', 'burrito', 'mexican', 'cantina']],
    ['chinese', ['chinese', 'dim sum', 'wok', 'dumpling']],
    ['japanese', ['sushi', 'ramen', 'japanese', 'izakaya']],
    ['indian', ['indian', 'curry', 'tandoori', 'spice']],
    ['thai', ['thai', 'pad thai', 'bangkok']],
    ['vietnamese', ['vietnamese', 'pho', 'banh mi']],
    ['american', ['burger', 'grill', 'american', 'steak']],
    ['french', ['french', 'bistro', 'cafe', 'patisserie']],
  ];
  
  const detectedCuisines = possibleCuisines
    .filter(([_, keywords]) => 
      keywords.some(keyword => name.includes(keyword))
    )
    .map(([cuisine]) => cuisine);
  
  return detectedCuisines.length ? detectedCuisines : ['unknown'];
} 