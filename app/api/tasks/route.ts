import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import Workspace from '@/models/Workspace';
import { requireAuth } from '@/middleware/auth';

// List tasks
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workspaceId = searchParams.get('workspaceId');
      const status = searchParams.get('status');

      if (!workspaceId) {
        return NextResponse.json(
          { error: 'Workspace ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      const query: any = { workspace: workspaceId };
      if (status) query.status = status;

      const tasks = await Task.find(query)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.error('List tasks error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Create task
export async function POST(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { workspaceId, title, description, priority, assignedTo, dueDate } = body;

      if (!workspaceId || !title) {
        return NextResponse.json(
          { error: 'Workspace ID and title are required' },
          { status: 400 }
        );
      }

      await connectDB();

      const task = await Task.create({
        workspace: workspaceId,
        title,
        description: description || '',
        priority: priority || 'medium',
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: authRequest.user!.userId,
        status: 'todo',
      });

      const populatedTask = await Task.findById(task._id)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar');

      return NextResponse.json(
        {
          success: true,
          task: populatedTask,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update task
export async function PATCH(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const body = await request.json();
      const { taskId, status, priority, assignedTo, title, description, dueDate } = body;

      if (!taskId) {
        return NextResponse.json(
          { error: 'Task ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      const updateData: any = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

      const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar');

      return NextResponse.json({
        success: true,
        task,
      });
    } catch (error) {
      console.error('Update task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete task
export async function DELETE(request: NextRequest) {
  return requireAuth(request, async (authRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const taskId = searchParams.get('id');

      if (!taskId) {
        return NextResponse.json(
          { error: 'Task ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      await Task.findByIdAndDelete(taskId);

      return NextResponse.json({
        success: true,
        message: 'Task deleted',
      });
    } catch (error) {
      console.error('Delete task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
