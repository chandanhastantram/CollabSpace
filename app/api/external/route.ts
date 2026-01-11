import { NextRequest, NextResponse } from 'next/server';
import { quotableAPI, weatherAPI } from '@/lib/publicAPIs';

// GET quote or weather data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'quote';

    if (type === 'quote') {
      const quote = await quotableAPI.getRandomQuote();
      return NextResponse.json({
        success: true,
        data: {
          content: quote.content,
          author: quote.author,
        },
      });
    }

    if (type === 'weather') {
      const lat = parseFloat(searchParams.get('lat') || '12.9716');
      const lon = parseFloat(searchParams.get('lon') || '77.5946');
      
      const weather = await weatherAPI.getCurrentWeather(lat, lon);
      return NextResponse.json({
        success: true,
        data: {
          temperature: weather.current_weather?.temperature,
          windSpeed: weather.current_weather?.windspeed,
          weatherCode: weather.current_weather?.weathercode,
          time: weather.current_weather?.time,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "quote" or "weather"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('External API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external data' },
      { status: 500 }
    );
  }
}
