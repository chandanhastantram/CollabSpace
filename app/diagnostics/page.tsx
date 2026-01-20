"use client";

import { useState } from 'react';

export default function DiagnosticPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnostics: any = {};

    // Test 1: Check Daily.co API Key
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test-room-' + Date.now() }),
      });
      const data = await res.json();
      diagnostics.dailyAPI = {
        status: res.ok ? 'OK' : 'FAILED',
        response: data,
      };
    } catch (error: any) {
      diagnostics.dailyAPI =  {
        status: 'ERROR',
        error: error.message,
      };
    }

    // Test 2: Check Pusher
    try {
      const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
      const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
      diagnostics.pusher = {
        keyPresent: !!pusherKey,
        clusterPresent: !!pusherCluster,
        key: pusherKey || 'NOT SET',
        cluster: pusherCluster || 'NOT SET',
      };
    } catch (error: any) {
      diagnostics.pusher = {
        status: 'ERROR',
        error: error.message,
      };
    }

    // Test 3: Check Environment Variables
    diagnostics.env = {
      nodeEnv: process.env.NODE_ENV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    };

    setResults(diagnostics);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">System Diagnostics</h1>
        
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Diagnostics'}
        </button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 capitalize">{key}</h2>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
