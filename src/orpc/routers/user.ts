import { z } from "zod";
import { base } from "@/orpc/base";

const userSchema = z.object({ id: z.string(), name: z.string() });

export const userRouter = base.router({
  list: base.output(z.array(userSchema)).handler(async () => {
    return [{ id: "1", name: "john doe" }];
  }),

  getById: base
    .input(z.object({ id: z.string() }))
    .output(userSchema)
    .handler(async () => {
      return { id: "1", name: "john doe" };
    }),
});
