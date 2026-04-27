// lib/roles.ts
export type UserRole =
  | "user"
  | "client"
  | "photographer"
  | "admin"
  | "super_admin";

export const isAdmin = (role?: UserRole | null) =>
  role === "admin" || role === "super_admin";

export const isPhotographer = (role?: UserRole | null) =>
  role === "photographer";
