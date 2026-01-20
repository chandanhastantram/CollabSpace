import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import mongoose from 'mongoose';

// PATCH /api/connections/[id] - Accept or reject a friend request
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { action } = await request.json(); // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const connectionId = new mongoose.Types.ObjectId(params.id);
    const userId = new mongoose.Types.ObjectId((session!.user as any).id);

    // Find the connection
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Only the recipient can accept/reject
    if (!connection.recipient.equals(userId)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    if (connection.status !== 'pending') {
      return NextResponse.json({ error: 'Request is not pending' }, { status: 400 });
    }

    // Update status
    connection.status = action === 'accept' ? 'accepted' : 'rejected';
    await connection.save();

    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'name email avatar')
      .populate('recipient', 'name email avatar');

    return NextResponse.json({
      message: action === 'accept' ? 'Friend request accepted' : 'Friend request rejected',
      connection: populatedConnection,
    });
  } catch (error: any) {
    console.error('Update connection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/connections/[id] - Unfriend/remove connection or cancel request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const connectionId = new mongoose.Types.ObjectId(params.id);
    const userId = new mongoose.Types.ObjectId((session!.user as any).id);

    // Find the connection
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Only requester or recipient can delete
    if (!connection.requester.equals(userId) && !connection.recipient.equals(userId)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await Connection.findByIdAndDelete(connectionId);

    return NextResponse.json({ message: 'Connection removed' });
  } catch (error: any) {
    console.error('Delete connection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
