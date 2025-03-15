'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Restaurant } from '@/lib/types';

// Add Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

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
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const dummyMapDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.google && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      // Create a dummy map div for PlacesService (required)
      if (!dummyMapDiv.current) {
        dummyMapDiv.current = document.createElement('div');
        placesService.current = new google.maps.places.PlacesService(dummyMapDiv.current);
      }
    }
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.trim().length > 2 && autocompleteService.current) {
        setIsSearching(true);
        try {
          const request: google.maps.places.AutocompletionRequest = {
            input: searchTerm,
            types: ['establishment'],
          };

          autocompleteService.current.getPlacePredictions(
            request,
            (
              predictions: google.maps.places.AutocompletePrediction[] | null,
              status: google.maps.places.PlacesServiceStatus
            ) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                const results: Restaurant[] = predictions.map((prediction: google.maps.places.AutocompletePrediction) => ({
                  name: prediction.structured_formatting?.main_text || prediction.description,
                  address: prediction.structured_formatting?.secondary_text || '',
                  placeId: prediction.place_id,
                }));
                setSearchResults(results);
              } else {
                setSearchResults([]);
              }
              setIsSearching(false);
            }
          );
        } catch (error) {
          console.error('Error searching places:', error);
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
    if (placesService.current && restaurant.placeId) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: restaurant.placeId,
        fields: ['name', 'formatted_address', 'url'],
      };

      placesService.current.getDetails(
        request,
        (
          place: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            onSelect({
              name: place.name || restaurant.name,
              address: place.formatted_address || restaurant.address,
              placeId: restaurant.placeId,
              url: place.url,
            });
          } else {
            onSelect(restaurant);
          }
        }
      );
    } else {
      onSelect(restaurant);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantName && restaurantAddress) {
      onSelect({
        name: restaurantName,
        address: restaurantAddress,
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
    </div>
  );
} 