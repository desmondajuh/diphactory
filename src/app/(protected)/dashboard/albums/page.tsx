import { albumManagerIsRequired } from "@/lib/auth-utils";
import { DashboardAlbumsView } from "@/features/dashboard/albums/views/dashboard-albums-view";

const Page = async () => {
  await albumManagerIsRequired();

  return <DashboardAlbumsView />;
};

export default Page;
