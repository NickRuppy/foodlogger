'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { PlusCircle } from "lucide-react";
import { Entry, Challenge } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import ChallengeCard from '@/app/components/ChallengeCard';
import Image from 'next/image';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recentMeals, setRecentMeals] = useState<Entry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      console.log('Starting loadData with user:', user?.uid);
      
      // Fetch challenges from API
      const challengesResponse = await fetch(`/api/challenges?userId=${user?.uid}`);
      const challengesData = await challengesResponse.json();
      console.log('Challenges data:', challengesData);
      
      // Fetch recent entries from API
      console.log('Fetching entries for user:', user?.uid);
      const entriesResponse = await fetch(`/api/entries/recent?userId=${user?.uid}`);
      console.log('Entries response status:', entriesResponse.status);
      const entriesData = await entriesResponse.json();
      console.log('Entries data:', entriesData);
      
      if (challengesData.success) {
        setChallenges(challengesData.challenges);
      } else {
        console.error("Error loading challenges:", challengesData.error);
      }
      
      if (entriesData.success) {
        console.log('Setting recent meals:', entriesData.entries);
        setRecentMeals(entriesData.entries);
      } else {
        console.error("Error loading entries:", entriesData.error);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, router, loadData]);

  // Use placeholder data when API calls fail
  const placeholderChallenges: Challenge[] = [
    {
      id: "cuisines",
      userId: user?.uid || '',
      name: "Around the World",
      description: "Try 10 different international cuisines",
      progress: 2,
      goal: 10,
      type: "cuisine",
      criteria: [],
      completed: false
    },
    {
      id: "restaurants",
      userId: user?.uid || '',
      name: "Local Explorer",
      description: "Visit 15 different local restaurants",
      progress: 5,
      goal: 15,
      type: "restaurant",
      criteria: [],
      completed: false
    },
    {
      id: "topRated",
      userId: user?.uid || '',
      name: "Foodie's Choice",
      description: "Try dishes with a rating above 8",
      progress: 3,
      goal: 10,
      type: "rating",
      criteria: [],
      completed: false
    },
    {
      id: "italian",
      userId: user?.uid || '',
      name: "Pasta Perfection",
      description: "Try 5 different Italian pasta dishes",
      progress: 1,
      goal: 5,
      type: "dish",
      criteria: [],
      completed: false
    }
  ];

  // Use placeholder data until API is properly connected
  const displayChallenges = challenges.length > 0 ? challenges : placeholderChallenges;

  if (authLoading || !user) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meal Logger</h1>
          <p className="text-gray-600">Welcome back, {user.displayName || 'User'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/add-entry" 
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle size={20} />
            <span>Add Entry</span>
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your meal data...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Challenges Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Challenges</h2>
              <Link 
                href="/challenges" 
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all challenges
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </section>

          {/* Recent Meals Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Meals</h2>
            
            {recentMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentMeals.map((meal) => (
                  <div key={meal.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {meal.dishes[0]?.photo && (
                      <div className="h-48 overflow-hidden">
                        <Image 
                          src={meal.dishes[0].photo} 
                          alt={meal.dishes[0].name} 
                          width={300}
                          height={200}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{meal.restaurantName}</h3>
                      <p className="text-gray-500 text-sm mb-2">{meal.restaurantAddress}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(meal.dateVisited).toLocaleDateString()} • {meal.dishes.length} dish{meal.dishes.length !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No meals logged yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first meal entry</p>
                <Link 
                  href="/add-entry" 
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>Add Your First Entry</span>
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
