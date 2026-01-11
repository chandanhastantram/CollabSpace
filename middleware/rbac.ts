import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { hasPermission, Permission, Role } from '@/lib/rbac';

/**
 * Middleware to require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Get token
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Check permission
  if (!hasPermission(payload.role as Role, permission)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return handler(request);
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requirePermission(request, 'admin:access', handler);
}
