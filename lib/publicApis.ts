// Public API integrations from https://github.com/public-apis/public-apis
// All APIs used are free and don't require authentication

// ============================================
// 1. Unsplash - Free Images
// ============================================
export async function getUnsplashImage(query: string = 'workspace'): Promise<string> {
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
}

export async function getRandomUnsplashImage(width: number = 800, height: number = 600): Promise<string> {
  return `https://source.unsplash.com/random/${width}x${height}`;
}

// ============================================
// 2. Lorem Picsum - Placeholder Images
// ============================================
export function getPicsumImage(width: number = 400, height: number = 300, id?: number): string {
  if (id) {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  }
  return `https://picsum.photos/${width}/${height}`;
}

export function getGrayscalePicsumImage(width: number = 400, height: number = 300): string {
  return `https://picsum.photos/${width}/${height}?grayscale`;
}

// ============================================
// 3. Quotable API - Inspirational Quotes
// ============================================
export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  length: number;
}

export async function getRandomQuote(): Promise<Quote | null> {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) throw new Error('Failed to fetch quote');
    return await response.json();
  } catch (error) {
    console.error('Quote API error:', error);
    return null;
  }
}

// ============================================
// 4. Open-Meteo Weather API (No API key needed!)
// ============================================
export interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  80: { description: 'Rain showers', icon: '🌦️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
};

export async function getWeather(latitude: number = 28.6139, longitude: number = 77.209): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    );
    if (!response.ok) throw new Error('Failed to fetch weather');
    const data = await response.json();
    
    const weatherCode = data.current.weather_code;
    const weather = weatherCodeMap[weatherCode] || { description: 'Unknown', icon: '🌡️' };
    
    return {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      description: weather.description,
      icon: weather.icon,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

// ============================================
// 5. RandomUser API - Demo Team Members
// ============================================
export interface RandomUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  phone: string;
}

export async function getRandomUsers(count: number = 5): Promise<RandomUser[]> {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    
    return data.results.map((user: any) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      avatar: user.picture.medium,
      location: `${user.location.city}, ${user.location.country}`,
      phone: user.phone,
    }));
  } catch (error) {
    console.error('RandomUser API error:', error);
    return [];
  }
}

// ============================================
// 6. Giphy API - GIFs (Using public beta key)
// ============================================
const GIPHY_API_KEY = 'dc6zaTOxFJmzC';

export interface GiphyResult {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
}

export async function searchGifs(query: string, limit: number = 10): Promise<GiphyResult[]> {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=g`
    );
    if (!response.ok) throw new Error('Failed to fetch GIFs');
    const data = await response.json();
    
    return data.data.map((gif: any) => ({
      id: gif.id,
      url: gif.images.original.url,
      title: gif.title,
      thumbnail: gif.images.fixed_height_small.url,
    }));
  } catch (error) {
    console.error('Giphy API error:', error);
    return [];
  }
}

export async function getTrendingGifs(limit: number = 10): Promise<GiphyResult[]> {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`
    );
    if (!response.ok) throw new Error('Failed to fetch trending GIFs');
    const data = await response.json();
    
    return data.data.map((gif: any) => ({
      id: gif.id,
      url: gif.images.original.url,
      title: gif.title,
      thumbnail: gif.images.fixed_height_small.url,
    }));
  } catch (error) {
    console.error('Giphy API error:', error);
    return [];
  }
}

// ============================================
// 7. Advice Slip API - Random Advice
// ============================================
export interface Advice {
  id: number;
  advice: string;
}

export async function getRandomAdvice(): Promise<Advice | null> {
  try {
    const response = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch advice');
    const data = await response.json();
    return data.slip;
  } catch (error) {
    console.error('Advice API error:', error);
    return null;
  }
}

// ============================================
// 8. Bored API - Activity Suggestions
// ============================================
export interface Activity {
  activity: string;
  type: string;
  participants: number;
  price: number;
  accessibility: number;
  key: string;
}

export async function getRandomActivity(): Promise<Activity | null> {
  try {
    const response = await fetch('https://www.boredapi.com/api/activity');
    if (!response.ok) throw new Error('Failed to fetch activity');
    return await response.json();
  } catch (error) {
    console.error('Bored API error:', error);
    return null;
  }
}

// ============================================
// 9. Dog CEO - Random Dog Images
// ============================================
export async function getRandomDogImage(): Promise<string | null> {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) throw new Error('Failed to fetch dog image');
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Dog API error:', error);
    return null;
  }
}

// ============================================
// 10. Cat API - Random Cat Images
// ============================================
export async function getRandomCatImage(): Promise<string | null> {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    if (!response.ok) throw new Error('Failed to fetch cat image');
    const data = await response.json();
    return data[0]?.url || null;
  } catch (error) {
    console.error('Cat API error:', error);
    return null;
  }
}

// ============================================
// 11. IP Geolocation
// ============================================
export interface IPLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  timezone: string;
  org: string;
}

export async function getIPLocation(): Promise<IPLocation | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Failed to get IP location');
    return await response.json();
  } catch (error) {
    console.error('IP API error:', error);
    return null;
  }
}

// ============================================
// 12. Public Holidays API
// ============================================
export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

export async function getPublicHolidays(year: number = new Date().getFullYear(), countryCode: string = 'IN'): Promise<Holiday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (!response.ok) throw new Error('Failed to fetch holidays');
    return await response.json();
  } catch (error) {
    console.error('Holidays API error:', error);
    return [];
  }
}
