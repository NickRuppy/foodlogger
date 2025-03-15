'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RestaurantSearch from '@/components/RestaurantSearch';
import DishForm from '@/components/DishForm';
import { Restaurant, Dish } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AddEntryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<'restaurant' | 'dishes' | 'review'>('restaurant');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setStep('dishes');
  };
  
  const handleAddDish = (dish: Dish) => {
    setDishes([...dishes, dish]);
  };
  
  const handleSaveEntry = async () => {
    if (!selectedRestaurant) {
      setError("Please select a restaurant");
      return;
    }

    if (dishes.length === 0) {
      setError("Please add at least one dish");
      return;
    }

    if (!user) {
      setError("You must be logged in to save entries");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null); // Clear any previous errors
      
      // Create entry data
      const entryData = {
        restaurant: selectedRestaurant,
        dishes,
        userId: user.uid
      };
      
      console.log('Saving entry data:', JSON.stringify(entryData, null, 2));
      
      // Save entry using API
      console.log('Calling /api/entries/add...');
      const response = await fetch('/api/entries/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to save the entry');
      }
      
      console.log('API response is OK, parsing JSON...');
      const data = await response.json();
      console.log('API response data:', data);
      
      // Update challenges with the new entry
      try {
        console.log('Calling /api/challenges/update...');
        const challengeResponse = await fetch('/api/challenges/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ entry: data.entry }),
        });
        
        console.log('Challenge update response status:', challengeResponse.status);
        const challengeData = await challengeResponse.json();
        console.log('Challenge update response data:', challengeData);
      } catch (challengeError) {
        console.error('Error updating challenges:', challengeError);
        // Continue with redirect even if challenge update fails
      }
      
      console.log('Redirecting to home page...');
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      setError(error instanceof Error ? error.message : 'Failed to save the entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold">Add New Entry</h1>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'restaurant' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'}`}>
          1
        </div>
        <div className={`h-1 flex-1 ${step === 'restaurant' ? 'bg-gray-200' : 'bg-primary-600'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'dishes' ? 'bg-primary-600 text-white' : step === 'review' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-400'}`}>
          2
        </div>
        <div className={`h-1 flex-1 ${step === 'review' ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
          3
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      {/* Step Content */}
      <div className="bg-white rounded-lg border p-6">
        {step === 'restaurant' && (
          <>
            <h2 className="text-xl font-semibold mb-4">Select Restaurant</h2>
            <p className="mb-4 text-gray-600">
              Search for a restaurant using Google Places or enter details manually.
            </p>
            <RestaurantSearch onSelect={handleRestaurantSelect} />
          </>
        )}
        
        {step === 'dishes' && (
          <>
            <h2 className="text-xl font-semibold mb-4">Add Dishes</h2>
            <div className="mb-4">
              <p className="text-gray-700 font-medium">{selectedRestaurant?.name}</p>
              <p className="text-gray-500 text-sm">{selectedRestaurant?.address}</p>
            </div>
            
            {dishes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Added Dishes:</h3>
                <div className="space-y-2">
                  {dishes.map(dish => (
                    <div key={dish.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{dish.name}</p>
                        <p className="text-sm text-gray-500">Rating: {dish.overallRating}/10</p>
                      </div>
                      <button 
                        onClick={() => setDishes(dishes.filter(d => d.id !== dish.id))}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <DishForm onAdd={handleAddDish} />
            
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => setStep('restaurant')}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setStep('review')}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                disabled={dishes.length === 0}
              >
                Continue
              </button>
            </div>
          </>
        )}
        
        {step === 'review' && (
          <>
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-1">Restaurant:</h3>
              <p className="text-gray-700">{selectedRestaurant?.name}</p>
              <p className="text-gray-500 text-sm">{selectedRestaurant?.address}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Dishes:</h3>
              <div className="space-y-3">
                {dishes.map(dish => (
                  <div key={dish.id} className="bg-gray-50 p-4 rounded">
                    <p className="font-medium">{dish.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <p>Overall: {dish.overallRating}/10</p>
                      <p>Price-Value: {dish.priceValueRating}/10</p>
                      <p>Taste: {dish.tasteRating}/10</p>
                      <p>Vibe: {dish.vibeRating}/10</p>
                    </div>
                    {dish.comments && (
                      <p className="mt-2 text-gray-600 text-sm">{dish.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setStep('dishes')}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button 
                onClick={handleSaveEntry}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 