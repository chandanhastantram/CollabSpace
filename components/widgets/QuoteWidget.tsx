"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';

interface QuoteData {
  content: string;
  author: string;
}

export function QuoteWidget() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/external?type=quote');
      const data = await response.json();
      if (data.success) {
        setQuote(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-xl p-6 border border-gray-200 dark:border-gray-800 relative">
      <Quote className="w-6 h-6 text-indigo-500/50 absolute top-4 left-4" />
      <div className="pl-8 pr-8">
        <p className="text-gray-900 dark:text-white italic mb-3">
          "{quote.content}"
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          — {quote.author}
        </p>
      </div>
      <button
        onClick={fetchQuote}
        className="absolute top-4 right-4 p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors"
        title="Get new quote"
      >
        <RefreshCw className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}
