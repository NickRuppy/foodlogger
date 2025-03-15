'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import ChallengeCard from '@/app/components/ChallengeCard';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChallengesPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  const loadChallenges = useCallback(async () => {
    if (!user) return;
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(challengesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const challengesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Challenge[];
      setChallenges(challengesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading challenges:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
} 