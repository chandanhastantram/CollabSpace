import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import pusherServer from '@/lib/pusher-server';

// Send a message
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
    const { content, workspaceId, channelId = 'general' } = body;

    if (!content || !workspaceId) {
      return NextResponse.json(
        { error: 'Missing content or workspaceId' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = session.user as any;

    // Create message in database
    const message = await Message.create({
      content,
      senderId: user.id,
      senderName: user.name || 'Anonymous',
      senderAvatar: user.image || '',
      workspaceId,
      channelId,
    });

    // Broadcast message via Pusher
    const channelName = `presence-workspace-${workspaceId}`;
    await pusherServer.trigger(channelName, 'new-message', {
      id: message._id.toString(),
      content: message.content,
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      channelId: message.channelId,
      createdAt: message.createdAt,
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        senderName: message.senderName,
        createdAt: message.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Get message history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const channelId = searchParams.get('channelId') || 'general';
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any = {
      workspaceId,
      channelId,
      isDeleted: false,
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      messages: messages.reverse().map(msg => ({
        id: msg._id.toString(),
        content: msg.content,
        senderId: msg.senderId.toString(),
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        channelId: msg.channelId,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get messages' },
      { status: 500 }
    );
  }
}
