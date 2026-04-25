"use client";

import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SocialProviders } from "../components/SocialProviders";
import AnonymousButton from "../components/anonymous-button";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  onSubmit: (
    formData: FormData,
  ) => Promise<{ ok: boolean; user?: string } | void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isSignUp = mode === "sign-up";

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmit(formData);

      if (result?.ok) router.push("/");
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {isSignUp
            ? "Join LuxeGems for exclusive access to fine jewelry"
            : "Sign in to your LuxeGems account"}
        </p>
      </div>

      {/* Social Providers */}
      <SocialProviders action={mode} />
      {!isSignUp ? (
        <AnonymousButton className="h-11 border-white/15 bg-white/5 text-white hover:bg-white/10" />
      ) : null}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
          or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        // onSubmit={(e) => e.preventDefault()}
      >
        {/* Name field - only for sign up */}
        {isSignUp && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-white/80">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 transition-all focus:border-accent-red/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-accent-red/20"
              />
            </div>
          </div>
        )}

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 transition-all focus:border-accent-red/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-accent-red/20"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-white/80"
            >
              Password
            </label>
            {!isSignUp && (
              <Link
                href="#"
                className="text-xs font-medium text-accent-red transition-colors hover:text-accent-red-300"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder={
                isSignUp ? "Create a password" : "Enter your password"
              }
              className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-11 text-sm text-white placeholder:text-white/30 transition-all focus:border-accent-red/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-accent-red/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red/50 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password - only for sign up */}
        {isSignUp && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-white/80"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 transition-all focus:border-accent-red/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-accent-red/20"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-accent-red mt-2 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red/50 active:scale-[0.98]"
        >
          {isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      {/* Toggle link */}
      <p className="text-center text-sm text-white/60">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-accent-red transition-colors hover:text-accent-red-300"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-accent-red transition-colors hover:text-accent-red-300"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
