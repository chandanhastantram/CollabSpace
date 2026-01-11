import AuditLog from '@/models/AuditLog';
import { NextRequest } from 'next/server';

export async function logAudit(
  userId: string,
  action: string,
  resourceType: 'document' | 'workspace' | 'user' | 'folder' | 'comment' | 'meeting',
  resourceId?: string,
  resourceName?: string,
  metadata?: Record<string, any>,
  request?: NextRequest
) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for') || 
                     request?.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request?.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: userId,
      action,
      resourceType,
      resourceId,
      resourceName,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}

export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}
