import { UserRole } from "@/lib/db/schema";
import { hasRole } from "@/lib/auth/roles";
import { AuthenticationError, AuthorizationError } from "@/lib/auth/errors";
import { getSession } from ".";
// import { hasRole } from "./roles";

export async function requireMinRole(requiredRole: UserRole) {
  const session = await getSession();

  if (!session?.user) {
    throw new AuthenticationError();
  }

  if (!hasRole(session.user.role as UserRole, requiredRole)) {
    throw new AuthorizationError(`Requires ${requiredRole} or higher`);
  }

  return session.user;
}
