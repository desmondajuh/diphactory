import { cache } from "react";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";

export const getSiteConfig = cache(async () => {
  const config = await db.query.siteConfig.findFirst();
  return config ?? null;
});
