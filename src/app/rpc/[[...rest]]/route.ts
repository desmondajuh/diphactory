import { onError, ORPCError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@/orpc/routers";
import { createContext } from "@/orpc/context";

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      if (!(error instanceof ORPCError)) {
        console.error(error);
      }
    }),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: await createContext(request),
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
