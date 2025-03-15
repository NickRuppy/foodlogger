'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  maxStars?: number;
}

export default function StarRating({ 
  rating, 
  setRating, 
  maxStars = 5 
}: StarRatingProps) {
  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => setRating(i)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            setRating(i);
          }
        }}
        className="p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
        title={`${i} stars`}
        aria-label={`Rate ${i} out of ${maxStars}`}
      >
        <Star
          className={`h-6 w-6 ${
            i <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    );
  }
  
  return (
    <div className="flex">
      {stars}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 self-center">
          {rating}/{maxStars}
        </span>
      )}
    </div>
  );
} 