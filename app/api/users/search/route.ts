import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Connection from '@/models/Connection';
import mongoose from 'mongoose';

// GET /api/users/search - Search for users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId((session!.user as any).id);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Search users by name or email (excluding current user)
    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name email avatar')
      .limit(20);

    // Get connection status for each user
    const userConnections = await Connection.find({
      $or: [
        { requester: userId, recipient: { $in: users.map(u => u._id) } },
        { recipient: userId, requester: { $in: users.map(u => u._id) } }
      ]
    });

    // Map connection status to users
    const usersWithStatus = users.map(user => {
      const connection = userConnections.find(
        c => c.requester.equals(user._id) || c.recipient.equals(user._id)
      );

      let connectionStatus = 'none';
      let connectionId = null;
      let isRequester = false;

      if (connection) {
        connectionStatus = connection.status;
        connectionId = connection._id;
        isRequester = connection.requester.equals(userId);
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        connectionStatus,
        connectionId,
        isRequester,
      };
    });

    return NextResponse.json({ users: usersWithStatus });
  } catch (error: any) {
    console.error('Search users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
