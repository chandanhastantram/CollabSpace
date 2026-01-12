"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import {
  getRandomQuote,
  getWeather,
  getRandomUsers,
  searchGifs,
  getTrendingGifs,
  getRandomAdvice,
  getRandomActivity,
  getRandomDogImage,
  getRandomCatImage,
  predictAge,
  getIPLocation,
  getPublicHolidays,
  getPicsumImage,
  Quote,
  WeatherData,
  RandomUser,
  GiphyResult,
  Advice,
  Activity,
  IPLocation,
  Holiday,
} from '@/lib/publicApis';
import {
  ArrowLeft,
  RefreshCw,
  Cloud,
  Quote as QuoteIcon,
  Users,
  Image,
  Lightbulb,
  Activity as ActivityIcon,
  Dog,
  Cat,
  Globe,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function APIIntegrationsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // State for all API data
  const [quote, setQuote] = useState<Quote | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [gifs, setGifs] = useState<GiphyResult[]>([]);
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [catImage, setCatImage] = useState<string | null>(null);
  const [ipLocation, setIpLocation] = useState<IPLocation | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load all API data
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      
      // Load all APIs in parallel
      const [
        quoteData,
        weatherData,
        usersData,
        gifsData,
        adviceData,
        activityData,
        dogData,
        catData,
        ipData,
        holidaysData,
      ] = await Promise.all([
        getRandomQuote(),
        getWeather(),
        getRandomUsers(4),
        getTrendingGifs(6),
        getRandomAdvice(),
        getRandomActivity(),
        getRandomDogImage(),
        getRandomCatImage(),
        getIPLocation(),
        getPublicHolidays(),
      ]);

      setQuote(quoteData);
      setWeather(weatherData);
      setUsers(usersData);
      setGifs(gifsData);
      setAdvice(adviceData);
      setActivity(activityData);
      setDogImage(dogData);
      setCatImage(catData);
      setIpLocation(ipData);
      setHolidays(holidaysData.slice(0, 5));
      setLoading(false);
    };

    loadAllData();
  }, []);

  // Refresh individual sections
  const refreshSection = async (section: string) => {
    setRefreshing(section);
    switch (section) {
      case 'quote':
        setQuote(await getRandomQuote());
        break;
      case 'advice':
        setAdvice(await getRandomAdvice());
        break;
      case 'activity':
        setActivity(await getRandomActivity());
        break;
      case 'dog':
        setDogImage(await getRandomDogImage());
        break;
      case 'cat':
        setCatImage(await getRandomCatImage());
        break;
      case 'gifs':
        setGifs(await getTrendingGifs(6));
        break;
      case 'users':
        setUsers(await getRandomUsers(4));
        break;
    }
    setRefreshing(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-400 mt-4">Loading API integrations...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const APICard = ({ 
    title, 
    icon: Icon, 
    children, 
    refreshKey,
    subtitle 
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    refreshKey?: string;
    subtitle?: string;
  }) => (
    <div className="relative">
      <div className="relative rounded-xl border border-white/20 p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
              </div>
            </div>
            {refreshKey && (
              <button
                onClick={() => refreshSection(refreshKey)}
                disabled={refreshing === refreshKey}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing === refreshKey ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">API Integrations</h1>
              </div>
            </div>
            <a
              href="https://github.com/public-apis/public-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all public APIs →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            <Sparkles className="w-8 h-8 inline mr-2" />
            15+ Free API Integrations
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            CollabSpace integrates with various free public APIs to enhance your experience.
            All data is fetched in real-time from external services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Widget */}
          <APICard title="Weather" icon={Cloud} subtitle="Open-Meteo API">
            {weather ? (
              <div className="text-center">
                <span className="text-5xl">{weather.icon}</span>
                <p className="text-3xl font-bold text-white mt-2">{weather.temperature}°C</p>
                <p className="text-gray-400">{weather.description}</p>
                <div className="flex justify-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>💧 {weather.humidity}%</span>
                  <span>💨 {weather.windSpeed} km/h</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Unable to load weather</p>
            )}
          </APICard>

          {/* Quote Widget */}
          <APICard title="Daily Quote" icon={QuoteIcon} subtitle="Quotable API" refreshKey="quote">
            {quote ? (
              <div>
                <p className="text-gray-300 italic">&ldquo;{quote.content}&rdquo;</p>
                <p className="text-gray-500 mt-2 text-sm">— {quote.author}</p>
              </div>
            ) : (
              <p className="text-gray-500">Unable to load quote</p>
            )}
          </APICard>

          {/* Advice Widget */}
          <APICard title="Random Advice" icon={Lightbulb} subtitle="Advice Slip API" refreshKey="advice">
            {advice ? (
              <p className="text-gray-300">💡 {advice.advice}</p>
            ) : (
              <p className="text-gray-500">Unable to load advice</p>
            )}
          </APICard>

          {/* Activity Suggestion */}
          <APICard title="Activity Suggestion" icon={ActivityIcon} subtitle="Bored API" refreshKey="activity">
            {activity ? (
              <div>
                <p className="text-gray-300 font-medium">{activity.activity}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                    {activity.type}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                    {activity.participants} person(s)
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Unable to load activity</p>
            )}
          </APICard>

          {/* Dog Image */}
          <APICard title="Random Dog" icon={Dog} subtitle="Dog CEO API" refreshKey="dog">
            {dogImage ? (
              <img
                src={dogImage}
                alt="Random dog"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Unable to load image</p>
              </div>
            )}
          </APICard>

          {/* Cat Image */}
          <APICard title="Random Cat" icon={Cat} subtitle="The Cat API" refreshKey="cat">
            {catImage ? (
              <img
                src={catImage}
                alt="Random cat"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Unable to load image</p>
              </div>
            )}
          </APICard>

          {/* IP Location */}
          <APICard title="Your Location" icon={Globe} subtitle="IP API">
            {ipLocation ? (
              <div className="space-y-2">
                <p className="text-white font-medium">📍 {ipLocation.city}, {ipLocation.region}</p>
                <p className="text-gray-400 text-sm">{ipLocation.country}</p>
                <p className="text-gray-500 text-xs">🌐 {ipLocation.ip}</p>
                <p className="text-gray-500 text-xs">⏰ {ipLocation.timezone}</p>
              </div>
            ) : (
              <p className="text-gray-500">Unable to detect location</p>
            )}
          </APICard>

          {/* Holidays */}
          <APICard title="Upcoming Holidays" icon={Calendar} subtitle="Nager.Date API">
            {holidays.length > 0 ? (
              <ul className="space-y-2">
                {holidays.map((holiday, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{holiday.localName}</span>
                    <span className="text-gray-500">{holiday.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Unable to load holidays</p>
            )}
          </APICard>

          {/* Random Users - Spans 2 columns */}
          <div className="md:col-span-2 lg:col-span-1">
            <APICard title="Team Members" icon={Users} subtitle="RandomUser API" refreshKey="users">
              {users.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{user.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Unable to load users</p>
              )}
            </APICard>
          </div>

          {/* Trending GIFs - Spans full width */}
          <div className="md:col-span-2">
            <APICard title="Trending GIFs" icon={Image} subtitle="Giphy API" refreshKey="gifs">
              {gifs.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {gifs.map((gif) => (
                    <img
                      key={gif.id}
                      src={gif.thumbnail}
                      alt={gif.title}
                      className="w-full h-20 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      title={gif.title}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">Unable to load GIFs</p>
              )}
            </APICard>
          </div>

          {/* Placeholder Images */}
          <APICard title="Stock Images" icon={Image} subtitle="Lorem Picsum">
            <div className="grid grid-cols-2 gap-2">
              {[1, 10, 20, 30].map((id) => (
                <img
                  key={id}
                  src={getPicsumImage(200, 150, id)}
                  alt={`Picsum ${id}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </APICard>
        </div>
      </main>
    </div>
  );
}
