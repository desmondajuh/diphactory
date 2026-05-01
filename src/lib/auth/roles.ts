// import { UserRole } from "./permissions";

// import { getSession } from ".";
import { UserRole } from "@/lib/db/schema";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  client: 1,
  photographer: 2,
  admin: 3,
  super_admin: 4,
};

export const hasRole = (userRole: UserRole, requiredRole: UserRole) =>
  ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];

// export async function requireMinRole(requiredRole: UserRole) {
//   const session = await getSession();

//   if (!session?.user) {
//     throw new Error("Unauthorized");
//   }

//   if (!hasRole(session.user.role as UserRole, requiredRole)) {
//     throw new Error(`Requires ${requiredRole} or higher`);
//   }

//   return session.user;
// }
