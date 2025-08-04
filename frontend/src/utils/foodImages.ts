// Food image mapping utility using public folder references
// This approach avoids TypeScript import issues with PNG files

// Mapping of food item names (case-insensitive) to their images
const foodImageMap: Record<string, string> = {
  // Beverages
  'masala chai': '/images/masala-chai.png',
  'chai': '/images/masala-chai.png',
  'tea': '/images/masala-chai.png',
  'juice': '/images/juice.png',
  'fresh juice': '/images/juice_1.png',
  'fruit juice': '/images/juice_1.png',

  // Breakfast items
  'poha': '/images/poha.png',
  'upma': '/images/upma.png',
  'idli sambar': '/images/idli_sambar.png',
  'idli': '/images/idli_sambar.png',
  'medu vada': '/images/medu_vada.png',
  'vada': '/images/medu_vada.png',
  'omelette': '/images/Omelette.png',
  'bhurji pav': '/images/bhurji_pav.png',
  'egg bhurji': '/images/bhurji_pav.png',

  // Main dishes
  'pav bhaji': '/images/pav_bhaji.png',
  'veg thali': '/images/veg_thali.png',
  'vegetarian thali': '/images/veg_thali.png',
  'thali': '/images/veg_thali.png',
  'non veg thali': '/images/non_veg_thali.png',
  'non-veg thali': '/images/non_veg_thali.png',
  'chicken thali': '/images/non_veg_thali.png',
  'chole bhature': '/images/chole_bhature.png',
  'chole': '/images/chole_bhature.png',
  'dal khichadi': '/images/dal_khichadi.png',
  'khichadi': '/images/dal_khichadi.png',
  'dal': '/images/dal_khichadi.png',
  'sabudana khichadi': '/images/sabudana_khichadi.png',
  'sabudana': '/images/sabudana_khichadi.png',

  // Snacks
  'sandwich': '/images/sandwich.png',
  'veg sandwich': '/images/sandwich.png',
  'grilled sandwich': '/images/sandwich.png',

  // Popular dishes (fallback mappings)
  'chicken biryani': '/images/non_veg_thali.png',
  'biryani': '/images/non_veg_thali.png',
  'paneer butter masala': '/images/veg_thali.png',
  'paneer': '/images/veg_thali.png',
  'dal tadka': '/images/dal_khichadi.png',
  'butter chicken': '/images/non_veg_thali.png',
  'masala dosa': '/images/idli_sambar.png',
  'dosa': '/images/idli_sambar.png',
  'paneer tikka': '/images/veg_thali.png',
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
  return '/images/veg_thali.png'; // Use veg thali as default
};

/**
 * Get all available food images as URLs
 * @returns Object containing all food image URLs
 */
export const getAllFoodImages = () => ({
  masalaChai: '/images/masala-chai.png',
  poha: '/images/poha.png',
  upma: '/images/upma.png',
  idliSambar: '/images/idli_sambar.png',
  meduVada: '/images/medu_vada.png',
  omelette: '/images/Omelette.png',
  bhurjiPav: '/images/bhurji_pav.png',
  pavBhaji: '/images/pav_bhaji.png',
  vegThali: '/images/veg_thali.png',
  nonVegThali: '/images/non_veg_thali.png',
  choleBhature: '/images/chole_bhature.png',
  dalKhichadi: '/images/dal_khichadi.png',
  sabudanaKhichadi: '/images/sabudana_khichadi.png',
  sandwich: '/images/sandwich.png',
  juice: '/images/juice.png',
  juice1: '/images/juice_1.png',
});

/**
 * Copy images to public folder helper function
 * This function provides instructions for manually copying images
 */
export const copyImagesToPublic = () => {
  console.log(`
To set up images, copy all PNG files from src/assets/ to public/images/:
1. Create directory: public/images/
2. Copy all .png files from src/assets/ to public/images/
3. Images will be accessible at /images/filename.png

Files to copy:
- masala-chai.png
- poha.png
- upma.png
- idli_sambar.png
- medu_vada.png
- Omelette.png
- bhurji_pav.png
- pav_bhaji.png
- veg_thali.png
- non_veg_thali.png
- chole_bhature.png
- dal_khichadi.png
- sabudana_khichadi.png
- sandwich.png
- juice.png
- juice_1.png
  `);
};

export default getFoodImage; 