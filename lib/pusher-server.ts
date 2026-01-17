import Pusher from 'pusher';

// Server-side Pusher instance
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
  useTLS: true,
});

export default pusherServer;

// Helper to trigger events
export async function triggerEvent(
  channel: string,
  event: string,
  data: any
) {
  try {
    await pusherServer.trigger(channel, event, data);
    return true;
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return false;
  }
}

// Helper to get channel members (presence channels)
export async function getChannelMembers(channel: string) {
  try {
    const response = await pusherServer.get({
      path: `/channels/${channel}/users`,
    });
    return response;
  } catch (error) {
    console.error('Pusher get members error:', error);
    return null;
  }
}
