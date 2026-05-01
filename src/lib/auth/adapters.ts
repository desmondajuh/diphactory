import { UploadThingError } from "uploadthing/server";
import { ORPCError } from "@orpc/server";
import { AuthenticationError, AuthorizationError } from "@/lib/auth/errors";
import { requireMinRole } from "@/lib/auth/require-role";
// import { requireMinRole } from "@/lib/auth/require-roles";
import { UserRole } from "@/lib/db/schema";

export async function requireMinRoleUploadThing(requiredRole: UserRole) {
  try {
    return await requireMinRole(requiredRole);
  } catch (e) {
    if (e instanceof AuthenticationError)
      throw new UploadThingError("Unauthorized");
    if (e instanceof AuthorizationError)
      throw new UploadThingError("Insufficient permissions");
    throw e;
  }
}

export async function requireMinRoleORPC(requiredRole: UserRole) {
  try {
    return await requireMinRole(requiredRole);
  } catch (e) {
    if (e instanceof AuthenticationError) throw new ORPCError("UNAUTHORIZED");
    if (e instanceof AuthorizationError) throw new ORPCError("FORBIDDEN");
    throw e;
  }
}
