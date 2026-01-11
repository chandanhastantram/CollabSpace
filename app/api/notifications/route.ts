import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { requireAuth } from '@/middleware/auth';

// List notifications
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const unreadOnly = searchParams.get('unreadOnly') === 'true';
      const limit = parseInt(searchParams.get('limit') || '50');

      await connectDB();

      const query: any = { recipient: authRequest.user!.userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('sender', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      const unreadCount = await Notification.countDocuments({
        recipient: authRequest.user!.userId,
        isRead: false,
      });

      return NextResponse.json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (error) {
      console.error('List notifications error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Mark as read
export async function PATCH(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { notificationId, markAllAsRead } = body;

      await connectDB();

      if (markAllAsRead) {
        await Notification.updateMany(
          { recipient: authRequest.user!.userId, isRead: false },
          { isRead: true }
        );
      } else if (notificationId) {
        await Notification.findOneAndUpdate(
          { _id: notificationId, recipient: authRequest.user!.userId },
          { isRead: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notifications marked as read',
      });
    } catch (error) {
      console.error('Mark notifications error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete notification
export async function DELETE(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const notificationId = searchParams.get('id');

      if (!notificationId) {
        return NextResponse.json(
          { error: 'Notification ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: authRequest.user!.userId,
      });

      return NextResponse.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
