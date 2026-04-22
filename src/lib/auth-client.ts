import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  adminClient,
  twoFactorClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { ac, roles } from "@/lib/auth/permissions";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: "include", // Required for session cookies
  },
  plugins: [
    // other plugin options
    anonymousClient(),
    twoFactorClient(),
    lastLoginMethodClient(),
    adminClient({
      ac,
      roles,
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
