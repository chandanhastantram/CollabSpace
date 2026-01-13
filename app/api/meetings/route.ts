import { NextRequest, NextResponse } from 'next/server';

const DAILY_API_KEY = process.env.DAILY_API_KEY || '';
const DAILY_API_URL = 'https://api.daily.co/v1';

// Create a new meeting room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, privacy = 'public', properties = {} } = body;

    // Create room via Daily.co API
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: name || undefined, // Let Daily generate if not provided
        privacy,
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          enable_knocking: false,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 10,
          ...properties,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.info || 'Failed to create room' },
        { status: response.status }
      );
    }

    const room = await response.json();

    return NextResponse.json({
      success: true,
      room: {
        url: room.url,
        name: room.name,
        created_at: room.created_at,
        config: room.config,
      },
    });
  } catch (error: any) {
    console.error('Create meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get meeting room details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('name');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }
      const error = await response.json();
      return NextResponse.json(
        { error: error.info || 'Failed to get room' },
        { status: response.status }
      );
    }

    const room = await response.json();

    return NextResponse.json({
      success: true,
      room: {
        url: room.url,
        name: room.name,
        created_at: room.created_at,
        config: room.config,
      },
    });
  } catch (error: any) {
    console.error('Get meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a meeting room
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('name');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.info || 'Failed to delete room' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete meeting error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
