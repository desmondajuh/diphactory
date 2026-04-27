// src/server/router.ts — root router
import { base } from "@/orpc/base";
import { userRouter } from "./user";
import { albumsRouter } from "./albums";
import { imagesRouter } from "./images";
import { accessRouter } from "./access";
import { favoritesRouter } from "./favorites";
import { clientsRouter } from "./clients";
import { leadsRouter } from "./leads";
import { bookingsRouter } from "./bookings";
import { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { testimonialsRouter } from "./testimonials";
import { galleryRouter } from "./gallery";

export const router = base.router({
  user: userRouter,
  leads: leadsRouter,
  albums: albumsRouter,
  images: imagesRouter,
  access: accessRouter,
  gallery: galleryRouter,
  clients: clientsRouter,
  bookings: bookingsRouter,
  favorites: favoritesRouter,
  testimonials: testimonialsRouter,
});

export type Router = typeof router;

export type Inputs = InferRouterInputs<Router>;
type UserGetByIdInput = Inputs["user"]["getById"];

export type Outputs = InferRouterOutputs<Router>;
type UserGetByIdOutput = Inputs["user"]["getById"];
