/**
 * Role-Based Access Control (RBAC) Module for Piloty Comment
 *
 * Implements least privilege authorization adhering to NIST SP 800-162 / CIS Benchmark.
 * Roles:
 * - ADMIN: Channel owner, full administrative control.
 * - MODERATOR: Comment reviewer, operational control without access to rules or account settings.
 * - UNAUTHENTICATED: Guest visitor, restricted strictly to public authentication endpoints.
 */

export type UserRole = "ADMIN" | "MODERATOR" | "UNAUTHENTICATED";

export type Permission =
  | "view:public"
  | "view:dashboard"
  | "view:comments"
  | "moderate:comments"
  | "view:videos"
  | "manage:rules"
  | "manage:settings"
  | "delete:account";

export type ResourceAction = {
  resource: string;
  action: "READ" | "WRITE" | "DELETE";
};

// Explicit Role-Permission Matrix
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  ADMIN: [
    "view:public",
    "view:dashboard",
    "view:comments",
    "moderate:comments",
    "view:videos",
    "manage:rules",
    "manage:settings",
    "delete:account",
  ],
  MODERATOR: [
    "view:public",
    "view:dashboard",
    "view:comments",
    "moderate:comments",
    "view:videos",
  ],
  UNAUTHENTICATED: [
    "view:public",
  ],
} as const;

export interface AccessDecision {
  allowed: boolean;
  role: UserRole;
  target: string;
  statusCode: 200 | 302 | 403;
  reason: string;
}

/**
 * Check whether a given role holds a specific permission.
 * Default is closed/deny.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Evaluate route access based on role and path.
 * Enforces fail-closed policy.
 */
export function authorizeRoute(role: UserRole, path: string): AccessDecision {
  // Public routes
  if (path.startsWith("/auth/login") || path.startsWith("/auth/signup")) {
    return {
      allowed: true,
      role,
      target: path,
      statusCode: 200,
      reason: "Public authentication route is accessible.",
    };
  }

  // Unauthenticated users are redirected from all internal routes
  if (role === "UNAUTHENTICATED") {
    return {
      allowed: false,
      role,
      target: path,
      statusCode: 302,
      reason: "Unauthenticated access redirected to /auth/login.",
    };
  }

  // Rules management requires manage:rules (ADMIN only)
  if (path.startsWith("/rules")) {
    if (hasPermission(role, "manage:rules")) {
      return {
        allowed: true,
        role,
        target: path,
        statusCode: 200,
        reason: "Admin has full permission to manage moderation rules.",
      };
    }
    return {
      allowed: false,
      role,
      target: path,
      statusCode: 403,
      reason: "Forbidden: Moderators cannot modify moderation rules.",
    };
  }

  // Settings & Account management requires manage:settings (ADMIN only)
  if (path.startsWith("/settings")) {
    if (hasPermission(role, "manage:settings")) {
      return {
        allowed: true,
        role,
        target: path,
        statusCode: 200,
        reason: "Admin has full permission to manage account settings.",
      };
    }
    return {
      allowed: false,
      role,
      target: path,
      statusCode: 403,
      reason: "Forbidden: Moderators cannot modify account settings.",
    };
  }

  // Common authenticated routes: /, /comments, /video
  if (
    path === "/" ||
    path.startsWith("/comments") ||
    path.startsWith("/video")
  ) {
    return {
      allowed: true,
      role,
      target: path,
      statusCode: 200,
      reason: "Authenticated role permitted for operational monitoring.",
    };
  }

  // Default deny
  return {
    allowed: false,
    role,
    target: path,
    statusCode: 403,
    reason: "Default deny: Route not explicitly permitted.",
  };
}

/**
 * Evaluate sensitive Server Action execution based on role.
 */
export function authorizeAction(
  role: UserRole,
  action: "UPDATE_EMAIL" | "UPDATE_PASSWORD" | "DELETE_ACCOUNT" | "MANAGE_RULES" | "MODERATE_COMMENT",
): AccessDecision {
  switch (action) {
    case "DELETE_ACCOUNT":
      if (hasPermission(role, "delete:account")) {
        return { allowed: true, role, target: action, statusCode: 200, reason: "Account deletion permitted for ADMIN." };
      }
      return { allowed: false, role, target: action, statusCode: 403, reason: "Forbidden: Only ADMIN can delete accounts." };

    case "UPDATE_EMAIL":
    case "UPDATE_PASSWORD":
      if (hasPermission(role, "manage:settings")) {
        return { allowed: true, role, target: action, statusCode: 200, reason: "Settings update permitted for ADMIN." };
      }
      return { allowed: false, role, target: action, statusCode: 403, reason: "Forbidden: Only ADMIN can update account credentials." };

    case "MANAGE_RULES":
      if (hasPermission(role, "manage:rules")) {
        return { allowed: true, role, target: action, statusCode: 200, reason: "Rules modification permitted for ADMIN." };
      }
      return { allowed: false, role, target: action, statusCode: 403, reason: "Forbidden: Only ADMIN can modify rules." };

    case "MODERATE_COMMENT":
      if (hasPermission(role, "moderate:comments")) {
        return { allowed: true, role, target: action, statusCode: 200, reason: "Comment moderation permitted for ADMIN and MODERATOR." };
      }
      return { allowed: false, role, target: action, statusCode: 403, reason: "Forbidden: Action requires comment moderation role." };

    default:
      return { allowed: false, role, target: action, statusCode: 403, reason: "Default deny: Unrecognized action." };
  }
}
