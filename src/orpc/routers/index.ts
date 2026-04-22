// src/server/router.ts — root router
import { base } from "@/orpc/base";
import { userRouter } from "./user";
import { albumsRouter } from "./albums";
import { imagesRouter } from "./images";
import { accessRouter } from "./access";
import { favoritesRouter } from "./favorites";
import { InferRouterInputs, InferRouterOutputs } from "@orpc/server";

// export const router = {
//   workspace: {
//     list: listWorkspace,
//   },
//   users: userRouter,
//   albums: albumsRouter,
//   images: imagesRouter,
//   access: accessRouter,
//   favorites: favoritesRouter,
// };

export const router = base.router({
  user: userRouter,
  albums: albumsRouter,
  images: imagesRouter,
  access: accessRouter,
  favorites: favoritesRouter,
});

export type Router = typeof router;

export type Inputs = InferRouterInputs<Router>;
type UserGetByIdInput = Inputs["user"]["getById"];

export type Outputs = InferRouterOutputs<Router>;
type UserGetByIdOutput = Inputs["user"]["getById"];
