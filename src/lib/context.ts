import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createContext(req: NextRequest) {
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
