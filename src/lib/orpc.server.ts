import "server-only";

import { headers } from "next/headers";
import { createRouterClient } from "@orpc/server";
// import { appRouter } from "@/orpc/router";
import { router } from "@/orpc/routers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

globalThis.$client = createRouterClient(router, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return {
      session,
      db,
      user: session?.user || null,
    };
  },
});
