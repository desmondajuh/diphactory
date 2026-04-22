// import { Context } from "@/lib/context";
import { os } from "@orpc/server";

// ── Base builder ──────────────────────────────────────────
// export const base = os.$context<Context>();
export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: "Too many request",
  },
  BAD_REQUEST: {
    message: "Bad request.",
  },
  NOT_FOUND: {
    message: "Not found",
  },
  FORBIDDEN: {
    message: "Action forbidden",
  },
  UNAUTHORIZED: {
    message: "You are Unauthorized",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal Server Error",
  },
});
