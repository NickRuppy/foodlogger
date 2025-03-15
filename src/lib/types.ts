// Restaurant related types
export type Restaurant = {
  name: string;
  address: string;
  placeId?: string;
  url?: string;
};

// Dish related types
export type Dish = {
  id: string;
  name: string;
  photo?: string;
  overallRating: number;
  priceValueRating: number;
  tasteRating: number;
  vibeRating: number;
  comments?: string;
};

// Entry (a visit to a restaurant with multiple dishes)
export type Entry = {
  id: string;
  userId: string;
  restaurantName: string;
  restaurantAddress: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  dateVisited: string | Date;
  dishes: Dish[];
};

// Challenge related types
export type ChallengeType = 'cuisine' | 'restaurant' | 'rating' | 'dish';

export type Challenge = {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: ChallengeType;
  criteria: string[];
  progress: number;
  goal: number;
  completed: boolean;
}; 