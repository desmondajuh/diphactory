// src/server/orpc.ts
import { os, ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth"; // BetterAuth server instance
import { db } from "@/lib/db";
import { headers } from "next/headers";
// import type { Context } from "@/lib/context";

// ── Request context ───────────────────────────────────────
// export type Context = {
//   session: { user: User; session: Session } | null;
//   db: typeof db;
// };

// export async function createContext(): Promise<Context> {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   }).catch(() => null);
//   return { session, db };
// }

export async function createContext(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    session,
    db,
    user: session?.user || null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// ── Base builder ──────────────────────────────────────────
export const base = os.$context<Context>();

// ── Middleware: require any authenticated user ─────────────
const isAuthed = base.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  if (!context.session) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      // Narrow type: session is guaranteed non-null below
      session: context.session,
    },
  });
});

// ── Middleware: require photographer role ─────────────────
const isPhotographer = isAuthed.concat(
  base.middleware(({ context, next }) => {
    if (context.session?.user.role !== "photographer") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only photographers can perform this action",
      });
    }
    return next({});
  }),
);

// ── Middleware: require client role ───────────────────────
const isClient = isAuthed.concat(
  base.middleware(({ context, next }) => {
    if (context.session?.user.role !== "client") {
      throw new ORPCError("FORBIDDEN");
    }
    return next({});
  }),
);

// ── Exported procedure builders ───────────────────────────
export const publicProcedure = base;
export const protectedProcedure = base.use(isAuthed);
export const photographerProcedure = base.use(isPhotographer);
export const clientProcedure = base.use(isClient);
