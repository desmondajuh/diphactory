import { cache } from "react";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous, lastLoginMethod } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendResetPasswordEmail } from "@/lib/email";
import { ac, roles } from "@/lib/auth/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail({
        to: user.email,
        subject: "Reset your password",
        url,
      });
    },
    requireEmailVerification: false,
  },
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  cookies: {
    sessionToken: {
      name: "auth_session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "client",
      adminRoles: ["admin", "super_admin"],
    }),
    nextCookies(),
    lastLoginMethod(),
    anonymous({
      emailDomainName:
        process.env.BETTER_AUTH_ANON_EMAIL_DOMAIN ?? "danaj.local",
    }),
  ],
});

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
);

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
