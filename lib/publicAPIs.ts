// Public APIs Integration
// Free APIs from https://github.com/public-apis/public-apis

// Unsplash API - Free stock photos (no API key required for demo)
export const unsplashAPI = {
  baseUrl: 'https://source.unsplash.com',
  
  // Get random image by size
  getRandom: (width = 800, height = 600) => 
    `https://source.unsplash.com/random/${width}x${height}`,
  
  // Get image by keyword
  getByKeyword: (keyword: string, width = 800, height = 600) =>
    `https://source.unsplash.com/random/${width}x${height}/?${keyword}`,
  
  // Get specific collections
  getWorkspace: () => `https://source.unsplash.com/random/800x600/?workspace,office`,
  getTeam: () => `https://source.unsplash.com/random/800x600/?team,collaboration`,
  getNature: () => `https://source.unsplash.com/random/800x600/?nature,landscape`,
  getTech: () => `https://source.unsplash.com/random/800x600/?technology,computer`,
};

// RoboHash API - Auto-generated avatars
export const robohashAPI = {
  baseUrl: 'https://robohash.org',
  
  // Generate avatar from email/string
  getAvatar: (seed: string, size = 200) =>
    `https://robohash.org/${encodeURIComponent(seed)}?size=${size}x${size}`,
  
  // Different avatar sets
  getRobot: (seed: string) => `https://robohash.org/${seed}?set=set1`, // Robots
  getMonster: (seed: string) => `https://robohash.org/${seed}?set=set2`, // Monsters
  getHead: (seed: string) => `https://robohash.org/${seed}?set=set3`, // Robot heads
  getCat: (seed: string) => `https://robohash.org/${seed}?set=set4`, // Cats
  getHuman: (seed: string) => `https://robohash.org/${seed}?set=set5`, // Humans
};

// Quotable API - Inspirational quotes
export const quotableAPI = {
  baseUrl: 'https://api.quotable.io',
  
  // Get random quote
  getRandomQuote: async () => {
    const response = await fetch('https://api.quotable.io/random');
    return response.json();
  },
  
  // Get quotes by tag
  getByTag: async (tag: string) => {
    const response = await fetch(`https://api.quotable.io/quotes?tags=${tag}`);
    return response.json();
  },
  
  // Get quote of the day (cached)
  getQuoteOfDay: async () => {
    const response = await fetch('https://api.quotable.io/random?maxLength=100');
    return response.json();
  },
};

// Open-Meteo Weather API - Free weather data (no API key required)
export const weatherAPI = {
  baseUrl: 'https://api.open-meteo.com/v1',
  
  // Get current weather by coordinates
  getCurrentWeather: async (latitude: number, longitude: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    return response.json();
  },
  
  // Get weather for major cities
  cities: {
    newYork: { lat: 40.7128, lon: -74.0060 },
    london: { lat: 51.5074, lon: -0.1278 },
    tokyo: { lat: 35.6762, lon: 139.6503 },
    bangalore: { lat: 12.9716, lon: 77.5946 },
    sydney: { lat: -33.8688, lon: 151.2093 },
  },
};

// JSONPlaceholder - Fake REST API for demo data
export const jsonPlaceholderAPI = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  
  // Get demo users
  getUsers: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
  },
  
  // Get demo posts
  getPosts: async (limit = 10) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
    return response.json();
  },
  
  // Get demo comments
  getComments: async (postId: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    return response.json();
  },
};

// DiceBear Avatars - More avatar options
export const dicebearAPI = {
  baseUrl: 'https://api.dicebear.com/7.x',
  
  // Different avatar styles
  getInitials: (seed: string) => 
    `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`,
  getPixelArt: (seed: string) => 
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`,
  getLorelei: (seed: string) => 
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`,
  getBottts: (seed: string) => 
    `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
  getAvataaars: (seed: string) => 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
};

// Lorem Picsum - Random placeholder images
export const picsumAPI = {
  baseUrl: 'https://picsum.photos',
  
  // Get random image
  getRandom: (width = 800, height = 600) =>
    `https://picsum.photos/${width}/${height}`,
  
  // Get specific image by ID
  getById: (id: number, width = 800, height = 600) =>
    `https://picsum.photos/id/${id}/${width}/${height}`,
  
  // Get grayscale
  getGrayscale: (width = 800, height = 600) =>
    `https://picsum.photos/${width}/${height}?grayscale`,
  
  // Get blurred
  getBlurred: (width = 800, height = 600, blur = 2) =>
    `https://picsum.photos/${width}/${height}?blur=${blur}`,
};

// Export all APIs
export const publicAPIs = {
  unsplash: unsplashAPI,
  robohash: robohashAPI,
  quotable: quotableAPI,
  weather: weatherAPI,
  jsonPlaceholder: jsonPlaceholderAPI,
  dicebear: dicebearAPI,
  picsum: picsumAPI,
};

export default publicAPIs;
