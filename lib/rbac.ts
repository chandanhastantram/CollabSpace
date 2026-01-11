// Role-Based Access Control (RBAC) Utilities

export type Role = 'user' | 'admin' | 'superadmin';

export type Permission =
  | 'workspace:create'
  | 'workspace:read'
  | 'workspace:update'
  | 'workspace:delete'
  | 'workspace:invite'
  | 'document:create'
  | 'document:read'
  | 'document:update'
  | 'document:delete'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'admin:access';

// Define permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  user: [
    'workspace:create',
    'workspace:read',
    'workspace:update',
    'workspace:invite',
    'document:create',
    'document:read',
    'document:update',
    'document:delete',
    'user:read',
    'user:update',
  ],
  admin: [
    'workspace:create',
    'workspace:read',
    'workspace:update',
    'workspace:delete',
    'workspace:invite',
    'document:create',
    'document:read',
    'document:update',
    'document:delete',
    'user:read',
    'user:update',
    'user:delete',
    'admin:access',
  ],
  superadmin: [
    'workspace:create',
    'workspace:read',
    'workspace:update',
    'workspace:delete',
    'workspace:invite',
    'document:create',
    'document:read',
    'document:update',
    'document:delete',
    'user:read',
    'user:update',
    'user:delete',
    'admin:access',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a user has a specific role
 */
export function hasRole(userRole: Role, requiredRole: Role | Role[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole);
}

/**
 * Check if a user is an admin (admin or superadmin)
 */
export function isAdmin(role: Role): boolean {
  return role === 'admin' || role === 'superadmin';
}

/**
 * Check if a user is a superadmin
 */
export function isSuperAdmin(role: Role): boolean {
  return role === 'superadmin';
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}
