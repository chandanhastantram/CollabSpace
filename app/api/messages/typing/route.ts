import { NextRequest, NextResponse } from 'next/server';
import pusherServer from '@/lib/pusher-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Trigger typing indicator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workspaceId, channelId = 'general', isTyping } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    const user = session.user as any;

    // Broadcast typing indicator
    const channelName = `presence-workspace-${workspaceId}`;
    await pusherServer.trigger(channelName, 'typing', {
      userId: user.id,
      userName: user.name || 'Anonymous',
      channelId,
      isTyping,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Typing indicator error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send typing indicator' },
      { status: 500 }
    );
  }
}
