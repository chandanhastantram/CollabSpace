import { NextRequest, NextResponse } from 'next/server';
import pusherServer from '@/lib/pusher-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Pusher authentication for private and presence channels
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.text();
    const params = new URLSearchParams(data);
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // For presence channels, include user data
    if (channel.startsWith('presence-')) {
      const presenceData = {
        user_id: (session.user as any).id,
        user_info: {
          name: session.user.name || 'Anonymous',
          email: session.user.email || '',
          avatar: session.user.image || '',
        },
      };

      const auth = pusherServer.authorizeChannel(socketId, channel, presenceData);
      return NextResponse.json(auth);
    }

    // For private channels
    const auth = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(auth);
  } catch (error: any) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
