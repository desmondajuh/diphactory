// import { os } from "@orpc/server";
import { base } from "@/orpc/base";
import z from "zod";
// import { base } from "../base";

export const listWorkspace = base
  .route({
    method: "GET",
    path: "/workspace",
    summary: "list all workspace",
    tags: ["workspace"],
  })
  .input(z.void())
  .output(z.void())
  .handler(async ({ input }) => {
    console.log(input);
  });
