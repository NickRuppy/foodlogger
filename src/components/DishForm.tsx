'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StarRating from './StarRating';
import { Dish } from '@/lib/types';
import Image from 'next/image';

interface DishFormProps {
  onAdd: (dish: Dish) => void;
}

export default function DishForm({ onAdd }: DishFormProps) {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [overallRating, setOverallRating] = useState(0);
  const [priceValueRating, setPriceValueRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [vibeRating, setVibeRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && overallRating > 0) {
      const newDish: Dish = {
        id: uuidv4(),
        name,
        photo: photo || undefined,
        overallRating,
        priceValueRating,
        tasteRating,
        vibeRating,
        comments: comments || undefined
      };
      
      onAdd(newDish);
      
      // Reset form
      setName('');
      setPhoto(null);
      setOverallRating(0);
      setPriceValueRating(0);
      setTasteRating(0);
      setVibeRating(0);
      setComments('');
    }
  };
  
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Adjust quality (0.7 = 70% quality)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        // Compress the image before storing
        const compressedImage = await compressImage(file);
        setPhoto(compressedImage);
        setPreviewUrl(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original image if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result as string);
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="dishName" className="block text-sm font-medium text-gray-700">
          Dish Name*
        </label>
        <input
          type="text"
          id="dishName"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Photo
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="photo-upload"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            {isCompressing ? 'Compressing...' : 'Choose Image'}
          </label>
          {photo && (
            <div className="h-20 w-20 overflow-hidden rounded-md border">
              <Image src={photo} alt="Dish preview" width={80} height={80} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Images will be automatically compressed for optimal storage.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Overall Rating*
        </label>
        <StarRating 
          rating={overallRating} 
          setRating={setOverallRating} 
          maxStars={10}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price-Value Rating
        </label>
        <StarRating 
          rating={priceValueRating} 
          setRating={setPriceValueRating} 
          maxStars={10}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taste Rating
        </label>
        <StarRating 
          rating={tasteRating} 
          setRating={setTasteRating} 
          maxStars={10}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vibe Rating
        </label>
        <StarRating 
          rating={vibeRating} 
          setRating={setVibeRating} 
          maxStars={10}
        />
      </div>
      
      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <textarea
          id="comments"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      
      <div className="text-right">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={!name || overallRating === 0 || isCompressing}
        >
          Add Dish
        </button>
      </div>
      
      {previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={200}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </form>
  );
} 