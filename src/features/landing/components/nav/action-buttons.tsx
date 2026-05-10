import { ArrowRight, UserIcon } from "lucide-react";
import Link from "next/link";

interface ActionButtonsProps {
  isLoggedIn?: boolean;
  role?: string;
  onItemClick?: () => void;
}

export const ActionButtons = ({
  role,
  isLoggedIn,
  onItemClick,
}: ActionButtonsProps) => {
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
    <div className="flex gap-2">
      <Link
        href="/bookings"
        onClick={onItemClick}
        className="group flex flex-1 items-center gap-2.5 rounded-full border border-accent-brand bg-accent-brand p-2 md:p-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-white"
        aria-label="Book Now"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-accent-brand group-hover:border group-hover:border-white"
          aria-hidden="true"
        >
          <ArrowRight className="h-3 w-3 text-accent-brand transition-colors duration-300 group-hover:text-white" />
        </span>
        Book Now
      </Link>
      <Link
        href={userUrl}
        onClick={onItemClick}
        className="rounded-full p-2 md:p-2.5 bg-accent-brand text-white"
      >
        <UserIcon />
      </Link>
    </div>
  );
};
