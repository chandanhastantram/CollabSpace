import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Document from '@/models/Document';
import Workspace from '@/models/Workspace';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { requireAuth } from '@/middleware/auth';

// Get analytics data
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');

      await connectDB();

      // Get workspace stats
      const totalDocuments = await Document.countDocuments(
        workspaceId ? { workspace: workspaceId } : {}
      );

      const totalWorkspaces = await Workspace.countDocuments();
      const totalUsers = await User.countDocuments();

      // Get recent activity
      const recentActivity = await Activity.find(
        workspaceId ? { workspace: workspaceId } : {}
      )
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email');

      // Get document creation trend (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const documentTrend = await Document.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            ...(workspaceId ? { workspace: workspaceId } : {}),
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return NextResponse.json({
        success: true,
        analytics: {
          totalDocuments,
          totalWorkspaces,
          totalUsers,
          recentActivity,
          documentTrend,
        },
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
