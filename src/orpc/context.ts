import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createContext(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    db,
    session,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
