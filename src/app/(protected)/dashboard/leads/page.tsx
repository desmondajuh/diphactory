import { albumManagerIsRequired } from "@/lib/auth-utils";
import { DashboardLeadsView } from "@/features/dashboard/leads/views/dashboard-leads-view";

const Page = async () => {
  await albumManagerIsRequired();

  return <DashboardLeadsView />;
};

export default Page;
