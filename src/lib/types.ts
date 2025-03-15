// Restaurant related types
export type Restaurant = {
  name: string;
  address: string;
  placeId?: string;
  url?: string;
};

// Dish related types
export interface Dish {
  id: string;
  name: string;
  photo?: string;
  overallRating: number;
  priceValueRating: number;
  tasteRating: number;
  vibeRating: number;
  comments?: string;
}

// Entry (a visit to a restaurant with multiple dishes)
export interface Entry {
  id: string;
  userId: string;
  restaurantName: string;
  restaurantAddress: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  dateVisited: string;
  dishes: Dish[];
}

// Challenge related types
export interface Challenge {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'cuisine' | 'restaurant' | 'rating' | 'dish';
  progress: number;
  goal: number;
  criteria: string[];
  completed: boolean;
} 