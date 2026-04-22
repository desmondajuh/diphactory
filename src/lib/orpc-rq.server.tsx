import "server-only";

import { cache } from "react";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import {
  dehydrate,
  HydrationBoundary,
  type FetchQueryOptions,
  type FetchInfiniteQueryOptions,
} from "@tanstack/react-query";

import { client } from "@/lib/orpc";
import { makeQueryClient } from "@/lib/query-client";

export const getQueryClient = cache(makeQueryClient);

// RSC . prefetch
export const orpc = createORPCReactQueryUtils(client);

export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export function prefetch(queryOptions: FetchQueryOptions) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(queryOptions);
}

export function prefetchInfinite(
  queryOptions: FetchInfiniteQueryOptions<
    unknown,
    Error,
    unknown,
    readonly unknown[],
    unknown
  >,
) {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(queryOptions);
}
