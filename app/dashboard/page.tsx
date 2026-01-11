import Link from 'next/link';
import { RadialOrbitalTimelineDemo } from '@/components/demo/RadialOrbitalTimelineDemo';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CollabSpace Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="pt-20">
        {/* Info Section */}
        <section className="py-8 px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Project Architecture Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Interactive visualization of CollabSpace features, their completion status, and how they connect together.
              Click any node to explore details and navigate between related features.
            </p>
          </div>
        </section>

        {/* Orbital Timeline */}
        <section className="relative">
          <RadialOrbitalTimelineDemo />
        </section>

        {/* Legend */}
        <section className="py-8 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              How to Use
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Auto-Rotation</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Features orbit automatically. Watch them rotate to see all components.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-black dark:border-white"></div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Click to Expand</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Click any node to see details, status, and connected features.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Energy Level</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Progress bar shows completion percentage for each feature.
                </p>
              </div>
            </div>

            {/* Status Legend */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Status Indicators</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black text-white border border-white">
                    COMPLETE
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Feature is live</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white text-black border border-black">
                    IN PROGRESS
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Currently developing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black/40 text-white border border-white/50">
                    PENDING
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Planned for future</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
