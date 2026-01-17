"use client";

import PusherClient from 'pusher-js';

// Client-side Pusher instance (singleton)
let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherClient) {
    pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY || '',
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
        authEndpoint: '/api/pusher/auth',
        authTransport: 'ajax',
      }
    );
  }
  return pusherClient;
}

// Clean up Pusher connection
export function disconnectPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}
