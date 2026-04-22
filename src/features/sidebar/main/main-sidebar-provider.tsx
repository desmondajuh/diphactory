import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "../components/main-sidebar";

interface Props {
  children: React.ReactNode;
}

export const MainSidebarProvider = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <MainSidebar />
      {/* <main> */}
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center justify-between p-4 border-b">
          <div className="w-ful flex items-center gap-x-2">{children}</div>
        </div>
        <SidebarTrigger />
      </div>
      {/* </main> */}
    </SidebarProvider>
  );
};
