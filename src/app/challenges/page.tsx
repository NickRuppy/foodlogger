'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import ChallengeCard from '@/app/components/ChallengeCard';

export default function ChallengesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadChallenges();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  async function loadChallenges() {
    try {
      const response = await fetch(`/api/challenges?userId=${user?.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setChallenges(data.challenges);
      } else {
        console.error("Error loading challenges:", data.error);
      }
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Challenges</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading challenges...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
        
        {!loading && challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No challenges found. They will be created automatically when you start logging meals!</p>
          </div>
        )}
      </div>
    </main>
  );
} 