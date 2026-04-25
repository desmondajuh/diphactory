import { adminIsRequired } from "@/lib/auth-utils";
import { AdminControlCenterView } from "@/features/dashboard/views/admin-control-center-view";

const Page = async () => {
  const session = await adminIsRequired();

  return (
    <AdminControlCenterView
      isSuperAdmin={session.user.role === "super_admin"}
    />
  );
};

export default Page;
