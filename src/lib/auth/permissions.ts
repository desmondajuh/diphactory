import { createAccessControl } from "better-auth/plugins/access";
import { adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...adminAc.statements,
} as const;

export const ac = createAccessControl(statement);

export const userRole = ac.newRole({
  user: [],
  session: [],
});

export const photographerRole = ac.newRole({
  user: [],
  session: [],
});

export const clientRole = ac.newRole({
  user: [],
  session: [],
});

export const adminRole = ac.newRole({
  user: ["list", "set-password", "update"],
  session: ["list", "revoke"],
});

export const superAdminRole = ac.newRole({
  ...adminAc.statements,
});

export const roles = {
  user: userRole,
  photographer: photographerRole,
  client: clientRole,
  admin: adminRole,
  super_admin: superAdminRole,
} as const;

export type RoleName = keyof typeof roles;
