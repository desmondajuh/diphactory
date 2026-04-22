// import { listWorkspace } from "./test";

import { listWorkspace } from "@/orpc/routers/test";

export const router = {
  workspace: {
    list: listWorkspace,
  },
};
