import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meeting from '@/models/Meeting';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List meetings
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');

      if (!workspaceId) {
        return NextResponse.json(
          { error: 'Workspace ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Verify workspace access
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      const isMember = workspace.members.some(
        (m: any) => m.user.toString() === authRequest.user!.userId
      );

      if (!isMember) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      const meetings = await Meeting.find({ workspace: workspaceId })
        .populate('host', 'name email avatar')
        .populate('participants', 'name email avatar')
        .sort({ startTime: 1 });

      return NextResponse.json({
        success: true,
        meetings,
      });
    } catch (error) {
      console.error('List meetings error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create meeting
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { workspaceId, title, description, startTime, endTime, participants } = body;

      if (!workspaceId || !title || !startTime || !endTime) {
        return NextResponse.json(
          { error: 'Required fields missing' },
          { status: 400 }
        );
      }

      await connectDB();

      // Generate unique meeting link
      const meetingLink = `${Math.random().toString(36).substring(2, 15)}`;

      const meeting = await Meeting.create({
        workspace: workspaceId,
        title,
        description: description || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        host: authRequest.user!.userId,
        participants: participants || [],
        meetingLink,
        status: 'scheduled',
      });

      const populatedMeeting = await Meeting.findById(meeting._id)
        .populate('host', 'name email avatar')
        .populate('participants', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          meeting: populatedMeeting,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create meeting error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
