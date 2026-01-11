import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import { requireAuth } from '@/middleware/auth';

// List audit logs
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      const action = searchParams.get('action');
      const resourceType = searchParams.get('resourceType');
      const limit = parseInt(searchParams.get('limit') || '50');

      await connectDB();

      const query: any = {};
      if (userId) query.user = userId;
      if (action) query.action = action;
      if (resourceType) query.resourceType = resourceType;

      const logs = await AuditLog.find(query)
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      return NextResponse.json({
        success: true,
        logs,
      });
    } catch (error) {
      console.error('List audit logs error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
