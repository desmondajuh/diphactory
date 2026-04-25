import { ORPCError } from "@orpc/server";
import { protectedProcedure } from "@/orpc/base";

const list = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;

  if (
    user.role !== "photographer" &&
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    throw new ORPCError("FORBIDDEN", {
      message: "You do not have access to view leads",
    });
  }

  const rows = await db.query.leads.findMany({
    with: {
      album: {
        columns: {
          id: true,
          title: true,
          slug: true,
          visibility: true,
          ownerId: true,
        },
      },
    },
    orderBy: (lead, { desc }) => [desc(lead.capturedAt)],
  });

  return rows.filter((leadRecord) =>
    user.role === "photographer"
      ? leadRecord.album.ownerId === user.id
      : true,
  );
});

export const leadsRouter = {
  list,
};
