import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
// import { createORPCReactQueryUtils } from "@orpc/react-query";
// import type { AppRouter } from "@/orpc/router";
// import { createTanstackQueryUtils } from "@orpc/tanstack-query"
// import { QueryCache, QueryClient } from "@tanstack/react-query"
// import { toast } from "sonner"
import { router } from "@/orpc/routers";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

// export const queryClient = new QueryClient({
//   queryCache: new QueryCache({
//     onError: (error) => {
//       toast.error(`Error: ${error.message}`, {
//         action: {
//           label: "retry",
//           onClick: () => {
//             queryClient.invalidateQueries()
//           }
//         }
//       })
//     }
//   })
// })

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${window.location.origin}/rpc`;
  },
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);
