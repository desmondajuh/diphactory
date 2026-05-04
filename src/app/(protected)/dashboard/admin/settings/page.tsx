// app/(dashboard)/admin/settings/page.tsx
import { client } from "@/lib/orpc";
import { SiteConfigView } from "@/features/admin/views/site-config-view";

export default async function SettingsPage() {
  const config = await client.siteConfig.get();
  return <SiteConfigView initialConfig={config} />;
}
