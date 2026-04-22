import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  email: string;
  image?: string | null | undefined;
  className?: string;
}

export const UserAvatar = ({ name, email, image, className }: Props) => {
  const { open } = useSidebar();
  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("h-9 w-9", !open && "h-5 w-5", className)}>
        <AvatarImage src={image || ""} />
        <AvatarFallback className="bg-accent-red text-white">
          {name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium truncate">{name}</span>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm text-muted-foreground truncate">
              {email}
            </span>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export const UserAvatarSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-9" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
};
