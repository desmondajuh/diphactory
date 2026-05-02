import { ArrowRight, UserIcon } from "lucide-react";
import Link from "next/link";

interface ActionButtonsProps {
  isLoggedIn?: boolean;
  role?: string;
}

export const ActionButtons = ({ role, isLoggedIn }: ActionButtonsProps) => {
  //   const userUrl = !isLoggedIn
  //     ? "/sign-in"
  //     : role === "admin"
  //       ? "/dashboard/admin"
  //       : role === "client"
  //         ? "/client"
  //         : role === "photographer"
  //           ? "/dashboard/albums"
  //           : "/dashboard";

  let userUrl = "/dashboard";

  if (!isLoggedIn) {
    userUrl = "/sign-in";
  } else if (role === "client") {
    userUrl = "/gallery";
  } else if (role === "photographer") {
    userUrl = "/dashboard";
  } else if (role === "admin") {
    userUrl = "/dashboard/admin";
  } else if (role === "super_admin") {
    userUrl = "/dashboard/admin";
  }

  return (
    <>
      <Link
        href="/bookings"
        className="group flex items-center gap-2.5 rounded-full border border-accent-red bg-accent-red px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-white"
        aria-label="Book Now"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-accent-red group-hover:border group-hover:border-white"
          aria-hidden="true"
        >
          <ArrowRight className="h-3 w-3 text-accent-red transition-colors duration-300 group-hover:text-white" />
        </span>
        Book Now
      </Link>
      <Link
        href={userUrl}
        className="rounded-full p-3 bg-accent-red text-white"
      >
        <UserIcon />
      </Link>
    </>
  );
};
