import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Entry, Challenge, Dish, Restaurant } from '../types';

// Collection references
const entriesCollection = 'entries';
const challengesCollection = 'challenges';
const userChallengesCollection = 'userChallenges';

/**
 * Detect cuisine type based on restaurant name and address
 * This is a simple placeholder that would be replaced with better logic or API
 */
function detectCuisineType(restaurantName: string, restaurantAddress: string): string[] {
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

/**
 * Add a new meal entry to Firestore
 */
export async function addEntry(restaurant: Restaurant, dishes: Dish[], userId: string): Promise<string> {
  try {
    const entryData: Entry = {
      id: uuidv4(),
      userId,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      googlePlaceId: restaurant.placeId,
      googleMapsUrl: restaurant.url,
      dateVisited: new Date().toISOString(),
      dishes
    };
    
    const docRef = await addDoc(collection(db, entriesCollection), entryData);
    
    // Update challenges based on this new entry
    await updateChallengesFromEntry(entryData, userId);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
}

/**
 * Get recent meal entries for a specific user
 */
export async function getRecentEntries(userId: string, limitCount = 5): Promise<Entry[]> {
  try {
    const q = query(
      collection(db, entriesCollection),
      where("userId", "==", userId),
      orderBy("dateVisited", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data() as Entry, id: doc.id }));
  } catch (error) {
    console.error("Error getting recent entries:", error);
    return [];
  }
}

/**
 * Get all challenges for a specific user
 */
export async function getChallenges(userId: string): Promise<Challenge[]> {
  try {
    const q = query(
      collection(db, userChallengesCollection),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data() as Challenge, id: doc.id }));
  } catch (error) {
    console.error("Error getting challenges:", error);
    return [];
  }
}

/**
 * Update challenges based on a new entry
 */
export async function updateChallengesFromEntry(entry: Entry, userId: string): Promise<void> {
  try {
    // Get user's challenges
    const challenges = await getChallenges(userId);
    
    // Detect cuisine type
    const cuisineTypes = detectCuisineType(entry.restaurantName, entry.restaurantAddress);
    
    for (const challenge of challenges) {
      let shouldUpdate = false;
      
      switch (challenge.type) {
        case 'cuisine':
          if (cuisineTypes.some(cuisine => challenge.criteria.includes(cuisine))) {
            shouldUpdate = true;
          }
          break;
          
        case 'restaurant':
          if (challenge.criteria.includes(entry.restaurantName) || 
              (entry.googlePlaceId && challenge.criteria.includes(entry.googlePlaceId))) {
            shouldUpdate = true;
          }
          break;
          
        case 'rating':
          const ratingThreshold = parseInt(challenge.criteria[0] || '8');
          if (entry.dishes.some(dish => dish.overallRating >= ratingThreshold)) {
            shouldUpdate = true;
          }
          break;
          
        case 'dish':
          if (entry.dishes.some(dish => 
            challenge.criteria.some(keyword => 
              dish.name.toLowerCase().includes(keyword.toLowerCase())
            )
          )) {
            shouldUpdate = true;
          }
          break;
      }
      
      if (shouldUpdate && challenge.progress < challenge.goal) {
        const challengeRef = doc(db, userChallengesCollection, challenge.id);
        const newProgress = challenge.progress + 1;
        const completed = newProgress >= challenge.goal;
        
        await updateDoc(challengeRef, {
          progress: newProgress,
          completed
        });
      }
    }
  } catch (error) {
    console.error("Error updating challenges:", error);
  }
}

/**
 * Initialize default challenges for a new user
 */
export async function initializeDefaultChallenges(userId: string): Promise<void> {
  try {
    // Check if user already has challenges
    const existingChallenges = await getChallenges(userId);
    
    if (existingChallenges.length === 0) {
      const defaultChallenges: Omit<Challenge, 'id'>[] = [
        {
          name: "Around the World",
          description: "Try 10 different international cuisines",
          type: "cuisine",
          criteria: ["italian", "mexican", "chinese", "japanese", "indian", "thai", "vietnamese", "american", "french", "korean"],
          progress: 0,
          goal: 10,
          completed: false,
          userId
        },
        {
          name: "Local Explorer",
          description: "Visit 15 different local restaurants",
          type: "restaurant",
          criteria: [],
          progress: 0,
          goal: 15,
          completed: false,
          userId
        },
        {
          name: "Foodie's Choice",
          description: "Try dishes with a rating above 8",
          type: "rating",
          criteria: ["8"],
          progress: 0,
          goal: 10,
          completed: false,
          userId
        },
        {
          name: "Pasta Perfection",
          description: "Try 5 different Italian pasta dishes",
          type: "dish",
          criteria: ["pasta", "spaghetti", "fettuccine", "linguine", "ravioli", "lasagna", "penne"],
          progress: 0,
          goal: 5,
          completed: false,
          userId
        }
      ];
      
      for (const challenge of defaultChallenges) {
        await addDoc(collection(db, userChallengesCollection), {
          ...challenge,
          id: uuidv4()
        });
      }
    }
  } catch (error) {
    console.error("Error initializing default challenges:", error);
  }
} 