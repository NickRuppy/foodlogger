import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where, doc, writeBatch } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Collection reference
const userChallengesCollection = 'userChallenges';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required', 
      }, { status: 400 });
    }
    
    // Create a query to get challenges for the specific user
    const q = query(
      collection(db, userChallengesCollection),
      where("userId", "==", userId)
    );
    
    // Get the documents
    const querySnapshot = await getDocs(q);
    const challenges = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    
    // If no challenges exist for the user, initialize default challenges
    if (challenges.length === 0) {
      await initializeDefaultChallenges(userId);
      
      // Fetch the newly created challenges
      const newQuerySnapshot = await getDocs(q);
      const newChallenges = newQuerySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      return NextResponse.json({ 
        challenges: newChallenges,
        success: true
      });
    }
    
    return NextResponse.json({ 
      challenges,
      success: true
    });
    
  } catch (error) {
    console.error('Error getting challenges:', error);
    return NextResponse.json({ 
      error: 'Failed to get challenges', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

async function initializeDefaultChallenges(userId: string) {
  const defaultChallenges = [
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

  const batch = writeBatch(db);
  const challengesRef = collection(db, userChallengesCollection);

  for (const challenge of defaultChallenges) {
    const newChallengeRef = doc(challengesRef);
    batch.set(newChallengeRef, challenge);
  }

  await batch.commit();
} 