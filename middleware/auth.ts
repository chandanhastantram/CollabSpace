import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/auth';

export interface AuthRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Get token from request headers or cookies
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const token = request.cookies.get('token')?.value;
  return token || null;
}

/**
 * Middleware to require authentication
 * Returns 401 if not authenticated
 */
export async function requireAuth(
  request: NextRequest,
  handler: (request: AuthRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user to request
  const authRequest = request as AuthRequest;
  authRequest.user = payload;

  return handler(authRequest);
}

/**
 * Middleware for optional authentication
 * Adds user to request if authenticated, but doesn't require it
 */
export async function optionalAuth(
  request: NextRequest,
  handler: (request: AuthRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = getTokenFromRequest(request);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const authRequest = request as AuthRequest;
      authRequest.user = payload;
    }
  }

  return handler(request as AuthRequest);
}

/**
 * Middleware to require specific role
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: string | string[],
  handler: (request: AuthRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!payload.role || !roles.includes(payload.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  const authRequest = request as AuthRequest;
  authRequest.user = payload;

  return handler(authRequest);
}
