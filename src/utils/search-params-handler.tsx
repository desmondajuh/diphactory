// SearchParamsHandler.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function SearchParamsHandler({
  onSession,
}: {
  onSession: (session: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const requestedSession = searchParams.get("session")?.toLowerCase();
    if (requestedSession) {
      onSession(requestedSession);
    }
  }, [searchParams, onSession]);

  return null;
}
