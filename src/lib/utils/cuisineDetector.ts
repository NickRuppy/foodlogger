import { Dish } from '@/lib/types';

/**
 * Detects the cuisine type based on dish name
 * @param dish The dish object
 * @returns The detected cuisine type or 'unknown'
 */
export function detectCuisineType(dish: Dish): string {
  const dishName = dish.name.toLowerCase();
  
  // Simple cuisine detection based on dish name
  if (dishName.includes('pasta') || dishName.includes('pizza') || dishName.includes('risotto')) {
    return 'italian';
  } else if (dishName.includes('taco') || dishName.includes('burrito') || dishName.includes('enchilada')) {
    return 'mexican';
  } else if (dishName.includes('sushi') || dishName.includes('ramen') || dishName.includes('tempura')) {
    return 'japanese';
  } else if (dishName.includes('curry') || dishName.includes('tikka') || dishName.includes('naan')) {
    return 'indian';
  } else if (dishName.includes('pad thai') || dishName.includes('tom yum')) {
    return 'thai';
  } else if (dishName.includes('pho') || dishName.includes('banh mi')) {
    return 'vietnamese';
  } else if (dishName.includes('burger') || dishName.includes('hot dog') || dishName.includes('bbq')) {
    return 'american';
  } else if (dishName.includes('croissant') || dishName.includes('baguette')) {
    return 'french';
  } else if (dishName.includes('kimchi') || dishName.includes('bibimbap')) {
    return 'korean';
  } else if (dishName.includes('dim sum') || dishName.includes('kung pao') || dishName.includes('chow mein')) {
    return 'chinese';
  }
  
  return 'unknown';
} 