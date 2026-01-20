import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET /api/connections - Get user's connections
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId((session!.user as any).id);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'accepted';
    const type = searchParams.get('type') || 'all'; // 'all', 'sent', 'received'

    let query: any = {};

    if (status === 'pending') {
      if (type === 'sent') {
        // Requests I sent
        query = { requester: userId, status: 'pending' };
      } else if (type === 'received') {
        // Requests I received
        query = { recipient: userId, status: 'pending' };
      } else {
        // All pending (sent and received)
        query = {
          $or: [
            { requester: userId, status: 'pending' },
            { recipient: userId, status: 'pending' }
          ]
        };
      }
    } else {
      // Accepted connections (friends)
      query = {
        $or: [
          { requester: userId, status: 'accepted' },
          { recipient: userId, status: 'accepted' }
        ]
      };
    }

    const connections = await Connection.find(query)
      .populate('requester', 'name email avatar')
      .populate('recipient', 'name email avatar')
      .sort({ createdAt: -1 });

    // Transform to get the "other" user for each connection
    const transformedConnections = connections.map(conn => {
      const isRequester = conn.requester._id.toString() === userId.toString();
      const otherUser = isRequester ? conn.recipient : conn.requester;
      return {
        _id: conn._id,
        user: otherUser,
        status: conn.status,
        isRequester,
        createdAt: conn.createdAt,
      };
    });

    return NextResponse.json({ connections: transformedConnections });
  } catch (error: any) {
    console.error('Get connections error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/connections - Send a friend request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { recipientId } = await request.json();

    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
    }

    const requesterId = new mongoose.Types.ObjectId((session!.user as any).id);
    const recipientObjId = new mongoose.Types.ObjectId(recipientId);

    // Can't send request to yourself
    if (requesterId.equals(recipientObjId)) {
      return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientObjId);
    if (!recipient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if connection already exists (in either direction)
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientObjId },
        { requester: recipientObjId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      if (existingConnection.status === 'accepted') {
        return NextResponse.json({ error: 'Already connected' }, { status: 400 });
      }
      if (existingConnection.status === 'pending') {
        return NextResponse.json({ error: 'Request already pending' }, { status: 400 });
      }
      if (existingConnection.status === 'blocked') {
        return NextResponse.json({ error: 'Cannot send request' }, { status: 400 });
      }
    }

    // Create new connection request
    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientObjId,
      status: 'pending',
    });

    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'name email avatar')
      .populate('recipient', 'name email avatar');

    return NextResponse.json({ 
      message: 'Friend request sent',
      connection: populatedConnection 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Send connection error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
