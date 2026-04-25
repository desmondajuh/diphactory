import { adminIsRequired } from "@/lib/auth-utils";
import { DashboardBookingsView } from "@/features/dashboard/bookings/views/dashboard-bookings-view";

const Page = async () => {
  await adminIsRequired();

  return <DashboardBookingsView />;
};

export default Page;
