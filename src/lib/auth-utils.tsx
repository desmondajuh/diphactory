import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, getSession } from "./auth";

export const authIsRequired = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

export const adminIsRequired = async () => {
  const session = await authIsRequired();
  const role = session.user.role;

  if (role !== "admin" && role !== "super_admin") {
    redirect("/");
  }

  return session;
};

export const isAdminUser = async () => {
  const session = await getSession();
  return (
    session?.user?.role === "admin" || session?.user?.role === "super_admin"
  );
};

export const authIsNotRequired = async () => {
  const session = await getSession();
  if (session) {
    redirect("/dashboard"); // or wherever logged-in users should go
  }
};

export const getAuthUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized - No session");
    }

    return session.user;
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Unauthorized");
  }
};

export async function getSafeSession(headers: Headers) {
  const startTime = Date.now();

  try {
    const session = await Promise.race([
      auth.api.getSession({ headers }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session fetch timeout")), 5000),
      ),
    ]);

    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.warn(`⚠️ Slow session fetch: ${duration}ms`);
    }

    return session;
  } catch (error) {
    console.error("❌ Session fetch failed:", {
      error: error instanceof Error ? error.message : error,
      duration: Date.now() - startTime,
    });
    return null;
  }
}
