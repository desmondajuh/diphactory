import type { Metadata } from "next";
// import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/lib/auth/actions";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/features/auth/view/AuthForm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Sign Up | LuxeGems",
  description: "Create your LuxeGems account",
};

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return <AuthForm mode="sign-up" onSubmit={signUp} />;
}
