import { authIsRequired } from "@/lib/auth-utils";
import { AdminControlCenterView } from "@/features/dashboard/views/admin-control-center-view";
import { ClientDashboardView } from "@/features/dashboard/views/client-dashboard-view";
import { PhotographerDashboardView } from "@/features/dashboard/views/photographer-dashboard-view";

const Page = async () => {
  const session = await authIsRequired();

  if (
    session.user.role === "admin" ||
    session.user.role === "super_admin"
  ) {
    return (
      <AdminControlCenterView
        isSuperAdmin={session.user.role === "super_admin"}
      />
    );
  }

  if (session.user.role === "photographer") {
    return <PhotographerDashboardView userId={session.user.id} />;
  }

  return (
    <ClientDashboardView
      userId={session.user.id}
      email={session.user.email}
      isAnonymous={Boolean(session.user.isAnonymous)}
    />
  );
};

export default Page;
