'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { searchPlaces } from '@/lib/googlePlaces';

interface RestaurantSearchProps {
  onSelect: (restaurant: Restaurant) => void;
}

export default function RestaurantSearch({ onSelect }: RestaurantSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [manualEntry, setManualEntry] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await searchPlaces(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching places:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    onSelect(restaurant);
  };
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantName && restaurantAddress) {
      onSelect({
        name: restaurantName,
        address: restaurantAddress
      });
    }
  };
  
  return (
    <div>
      {!manualEntry ? (
        <>
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search for a restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="mt-2 text-right">
              <button 
                type="button" 
                className="text-primary-600 text-sm hover:text-primary-800"
                onClick={() => setManualEntry(true)}
              >
                Enter manually instead
              </button>
            </div>
          </form>
          
          {/* Search Results */}
          {isSearching && (
            <div className="text-center py-4">
              <div className="animate-pulse text-gray-500">Searching...</div>
            </div>
          )}
          
          {!isSearching && searchTerm.length > 2 && searchResults.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No results found. Try a different search or enter details manually.
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-md overflow-hidden divide-y">
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectRestaurant(result)}
                >
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.address}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurantName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="restaurantAddress" className="block text-sm font-medium text-gray-700">
                Restaurant Address
              </label>
              <input
                type="text"
                id="restaurantAddress"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={restaurantAddress}
                onChange={(e) => setRestaurantAddress(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button 
                type="button" 
                className="text-primary-600 text-sm hover:text-primary-800"
                onClick={() => setManualEntry(false)}
              >
                Search instead
              </button>
              <button 
                type="submit" 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          Note: A Google Maps API key will be required to enable restaurant search functionality.
        </p>
      </div>
    </div>
  );
} 