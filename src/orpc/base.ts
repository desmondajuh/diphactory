import { ORPCError, os } from "@orpc/server";
import type { Context } from "@/orpc/context";

export const base = os.$context<Context>();

type AuthedContext = Context & {
  session: NonNullable<Context["session"]>;
  user: NonNullable<Context["user"]>;
};

const isAuthed = base.middleware(({ context, next }) => {
  const session = context.session;
  const user = session?.user ?? null;

  if (!session || !user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      ...context,
      session,
      user,
    } as AuthedContext,
  });
});

const isPhotographer = isAuthed.concat(
  base.middleware(({ context, next }) => {
    const user = context.user;

    if (!user || user.role !== "photographer") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only photographers can perform this action",
      });
    }

    return next({
      context: {
        ...context,
        user,
      } as AuthedContext,
    });
  }),
);

const isClient = isAuthed.concat(
  base.middleware(({ context, next }) => {
    const user = context.user;

    if (!user || user.role !== "client") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only clients can perform this action",
      });
    }

    return next({
      context: {
        ...context,
        user,
      } as AuthedContext,
    });
  }),
);

export const publicProcedure = base;
export const protectedProcedure = base.use(isAuthed);
export const photographerProcedure = base.use(isPhotographer);
export const clientProcedure = base.use(isClient);
