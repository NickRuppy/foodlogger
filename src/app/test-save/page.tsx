'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestSavePage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      // Test data
      const testData = {
        restaurant: {
          name: "Test Restaurant",
          address: "123 Test Street",
          placeId: "test-place-id",
          url: "https://maps.google.com"
        },
        dishes: [
          {
            id: "test-dish-id",
            name: "Test Dish",
            overallRating: 8,
            priceValueRating: 7,
            tasteRating: 9,
            vibeRating: 8,
            comments: "This is a test dish"
          }
        ]
      };
      
      console.log('Saving test data:', JSON.stringify(testData, null, 2));
      
      // Call the API
      const response = await fetch('/api/entries/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      console.log('API response status:', response.status);
      
      const data = await response.json();
      console.log('API response data:', data);
      
      setResult(data);
    } catch (err) {
      console.error('Error in test save:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Save Entry</h1>
      
      <button
        onClick={handleTestSave}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Test Save Entry'}
      </button>
      
      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
          <h2 className="font-bold">Result:</h2>
          <pre className="mt-2 whitespace-pre-wrap overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 