"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type AnonymousButtonProps = {
  className?: string;
};

export default function AnonymousButton({ className }: AnonymousButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignInAnonymous = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.anonymous();
      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not start a guest session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className={className}
        onClick={handleSignInAnonymous}
        disabled={isLoading}
      >
        <User />
        {isLoading ? "Starting guest session..." : "Continue as guest"}
      </Button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
