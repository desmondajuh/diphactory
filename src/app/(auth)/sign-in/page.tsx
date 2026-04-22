import type { Metadata } from "next";
// import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/lib/auth/actions";
import { AuthForm } from "@/features/auth/view/AuthForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Sign In | ${APP_NAME}`,
  description: `Sign in to your ${APP_NAME} account`,
};

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <AuthForm mode="sign-in" onSubmit={signIn} />;
}
