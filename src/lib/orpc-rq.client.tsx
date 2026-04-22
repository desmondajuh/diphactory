"use client";

import { useState } from "react";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { client } from "@/lib/orpc";
import { makeQueryClient } from "@/lib/query-client";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// queryOptions / mutationsOptions / infiniteOptions / key
export const orpc = createORPCReactQueryUtils(client);

export function ORPCQueryProvider({ children }: { children: React.ReactNode }) {
  // NOTE: usestate query client
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
