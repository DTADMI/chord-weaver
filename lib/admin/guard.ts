import { createServerClient } from "@/lib/supabase/client";
import { isFeatureEnabled } from "@/lib/feature-flags";

export type AdminRole = "admin" | "superadmin" | "moderator";

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
}

export async function requireAdmin(request: Request): Promise<AdminSession> {
  if (!isFeatureEnabled("admin-dashboard")) {
    throw new Error("Admin dashboard is disabled");
  }

  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!adminUser) {
    throw new Error("Admin access required");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role: adminUser.role as AdminRole,
  };
}

export async function requireRole(
  request: Request,
  minimumRole: AdminRole,
): Promise<AdminSession> {
  const session = await requireAdmin(request);
  const roleHierarchy: Record<AdminRole, number> = {
    moderator: 1,
    admin: 2,
    superadmin: 3,
  };
  if (roleHierarchy[session.role] < roleHierarchy[minimumRole]) {
    throw new Error(`Requires ${minimumRole} role or higher`);
  }
  return session;
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}
