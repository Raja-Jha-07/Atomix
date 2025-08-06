// Food image mapping utility using assets folder references
// Import images from assets for better bundling and optimization

// Import all images from assets
import masalaChai from '../assets/masala-chai.png';
import poha from '../assets/poha.png';
import upma from '../assets/upma.png';
import idliSambar from '../assets/idli_sambar.png';
import meduVada from '../assets/medu_vada.png';
import omelette from '../assets/Omelette.png';
import bhurjiPav from '../assets/bhurji_pav.png';
import pavBhaji from '../assets/pav_bhaji.png';
import vegThali from '../assets/veg_thali.png';
import nonVegThali from '../assets/non_veg_thali.png';
import choleBhature from '../assets/chole_bhature.png';
import dalKhichadi from '../assets/dal_khichadi.png';
import sabudanaKhichadi from '../assets/sabudana_khichadi.png';
import sandwich from '../assets/sandwich.png';
import juice from '../assets/juice.png';
import juice1 from '../assets/juice_1.png';

// Mapping of food item names (case-insensitive) to their images
const foodImageMap: Record<string, string> = {
  // Beverages
  'masala chai': masalaChai,
  'chai': masalaChai,
  'tea': masalaChai,
  'juice': juice,
  'fresh juice': juice1,
  'fruit juice': juice1,

  // Breakfast items
  'poha': poha,
  'upma': upma,
  'idli sambar': idliSambar,
  'idli': idliSambar,
  'medu vada': meduVada,
  'vada': meduVada,
  'omelette': omelette,
  'bhurji pav': bhurjiPav,
  'egg bhurji': bhurjiPav,

  // Main dishes
  'pav bhaji': pavBhaji,
  'veg thali': vegThali,
  'vegetarian thali': vegThali,
  'thali': vegThali,
  'non veg thali': nonVegThali,
  'non-veg thali': nonVegThali,
  'chicken thali': nonVegThali,
  'chole bhature': choleBhature,
  'chole': choleBhature,
  'dal khichadi': dalKhichadi,
  'khichadi': dalKhichadi,
  'dal': dalKhichadi,
  'sabudana khichadi': sabudanaKhichadi,
  'sabudana': sabudanaKhichadi,

  // Snacks
  'sandwich': sandwich,
  'veg sandwich': sandwich,
  'grilled sandwich': sandwich,

  // Popular dishes (fallback mappings)
  'chicken biryani': nonVegThali,
  'biryani': nonVegThali,
  'paneer butter masala': vegThali,
  'paneer': vegThali,
  'dal tadka': dalKhichadi,
  'butter chicken': nonVegThali,
  'masala dosa': idliSambar,
  'dosa': idliSambar,
  'paneer tikka': vegThali,
};

/**
 * Get the image for a food item based on its name
 * @param itemName - The name of the food item
 * @returns The image URL/path for the food item, or a default image if not found
 */
export const getFoodImage = (itemName: string): string => {
  const normalizedName = itemName.toLowerCase().trim();
  
  // Try exact match first
  if (foodImageMap[normalizedName]) {
    return foodImageMap[normalizedName];
  }
  
  // Try partial matches
  for (const [key, image] of Object.entries(foodImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return image;
    }
  }
  
  // Default fallback image
  return vegThali; // Use veg thali as default
};

/**
 * Get all available food images as imported assets
 * @returns Object containing all food image imports
 */
export const getAllFoodImages = () => ({
  masalaChai,
  poha,
  upma,
  idliSambar,
  meduVada,
  omelette,
  bhurjiPav,
  pavBhaji,
  vegThali,
  nonVegThali,
  choleBhature,
  dalKhichadi,
  sabudanaKhichadi,
  sandwich,
  juice,
  juice1,
});

/**
 * Image assets information
 * This provides the imported asset references for direct use
 */
export const imageAssets = {
  masalaChai,
  poha,
  upma,
  idliSambar,
  meduVada,
  omelette,
  bhurjiPav,
  pavBhaji,
  vegThali,
  nonVegThali,
  choleBhature,
  dalKhichadi,
  sabudanaKhichadi,
  sandwich,
  juice,
  juice1,
};

export default getFoodImage; 