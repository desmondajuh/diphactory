import { photographerIsRequired } from "@/lib/auth-utils";
import { DashboardClientsView } from "@/features/dashboard/clients/views/dashboard-clients-view";

const Page = async () => {
  await photographerIsRequired();

  return <DashboardClientsView />;
};

export default Page;
