"use client";

import { useState } from 'react';
import { QuoteWidget } from '@/components/widgets/QuoteWidget';
import { DynamicAvatar, AvatarPicker } from '@/components/widgets/DynamicAvatar';
import { ExternalLink, User, Quote } from 'lucide-react';

export default function PublicAPIDemo() {
  const [avatarStyle, setAvatarStyle] = useState<string>('initials');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Public APIs Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Demonstrating integration of free public APIs from{' '}
            <a 
              href="https://github.com/public-apis/public-apis" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center"
            >
              public-apis <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </p>
        </div>

        {/* Quote Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Quote className="w-6 h-6 mr-2 text-indigo-500" />
            Inspirational Quotes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quotable API - Free quotes</p>
          <QuoteWidget />
        </section>

        {/* Avatars Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-purple-500" />
            Dynamic Avatars
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Using DiceBear & RoboHash APIs - Click to select a style
            </p>
            <AvatarPicker 
              seed="demo@collabspace.com" 
              onSelect={(style) => setAvatarStyle(style)}
            />
            <div className="mt-6 flex items-center space-x-4">
              <p className="text-gray-600 dark:text-gray-400">Selected:</p>
              <DynamicAvatar 
                seed="demo@collabspace.com" 
                style={avatarStyle as any} 
                size={64} 
              />
              <span className="text-sm text-gray-500 capitalize">{avatarStyle}</span>
            </div>
          </div>
        </section>

        {/* API List */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Integrated APIs
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'DiceBear', desc: 'Avatar generation', url: 'https://dicebear.com' },
              { name: 'RoboHash', desc: 'Robot avatars', url: 'https://robohash.org' },
              { name: 'Quotable', desc: 'Inspirational quotes', url: 'https://quotable.io' },
              { name: 'JSONPlaceholder', desc: 'Mock REST API', url: 'https://jsonplaceholder.typicode.com' },
            ].map((api) => (
              <a
                key={api.name}
                href={api.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{api.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{api.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </section>

        {/* Usage Code */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Usage Example
          </h2>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-auto text-sm">
{`import { publicAPIs } from '@/lib/publicAPIs';
import { QuoteWidget } from '@/components/widgets/QuoteWidget';
import { DynamicAvatar } from '@/components/widgets/DynamicAvatar';

// Use components directly
<QuoteWidget />
<DynamicAvatar seed="user@email.com" style="avataaars" />

// Or use the API utilities
const randomQuote = await publicAPIs.quotable.getRandomQuote();
const avatarUrl = publicAPIs.dicebear.getAvataaars(userEmail);`}
          </pre>
        </section>
      </div>
    </div>
  );
}
