import { ORPCError, os } from "@orpc/server";
import type { Context } from "@/orpc/context";
import { UserRole } from "@/lib/db/schema";
import { ROLE_HIERARCHY } from "@/lib/auth/roles";

export const base = os.$context<Context>();

type AuthedContext = Context & {
  session: NonNullable<Context["session"]>;
  user: NonNullable<Context["user"]> & {
    role: UserRole;
  };
};

// ── Role Hierarchy ────────────────────────────────────────────────────────────
// Higher index = more privileged. A role passes any gate at or below its level.

// const ROLE_HIERARCHY: Record<UserRole, number> = {
//   user: 0,
//   client: 1,
//   photographer: 2,
//   admin: 3,
//   super_admin: 4,
// };

// Returns the minimum privilege level required for a set of roles
const minLevelFor = (roles: UserRole[]) =>
  Math.min(...roles.map((r) => ROLE_HIERARCHY[r]));

const hasAccess = (userRole: UserRole, requiredRoles: UserRole[]) =>
  ROLE_HIERARCHY[userRole] >= minLevelFor(requiredRoles);

// ── Middlewares ───────────────────────────────────────────────────────────────

const isAuthed = base.middleware(({ context, next }) => {
  const session = context.session;
  const user = session?.user ?? null;

  if (!session || !user || !user.role) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      ...context,
      session,
      user: {
        ...user,
        role: user.role as UserRole,
      },
    } satisfies AuthedContext,
  });
});

const requireRole = (roles: UserRole[]) =>
  isAuthed.concat(
    os.$context<AuthedContext>().middleware(({ context, next }) => {
      if (!hasAccess(context.user.role, roles)) {
        throw new ORPCError("FORBIDDEN", {
          message: `Requires one of: ${roles.join(", ")}`,
        });
      }
      return next({ context });
    }),
  );

// ── Procedures ────────────────────────────────────────────────────────────────

export const publicProcedure = base;
export const protectedProcedure = base.use(isAuthed); // any logged-in user
export const clientProcedure = base.use(requireRole(["client"])); // client, photographer, admin, super_admin
export const photographerProcedure = base.use(requireRole(["photographer"])); // photographer, admin, super_admin
export const adminProcedure = base.use(requireRole(["admin"])); // admin, super_admin
export const superAdminProcedure = base.use(requireRole(["super_admin"])); // super_admin only
