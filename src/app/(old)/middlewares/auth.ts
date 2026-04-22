import { Context } from "@/lib/context";
import { base } from "./base";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// export const requiredAuthMiddleware = base.$context<Context>();
export const requiredAuthMiddleware = base
  .$context<Context>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    if (!session?.user) {
      return redirect("/api/auth/login");
    }

    return next({
      context: { user: session.user },
    });
  });
