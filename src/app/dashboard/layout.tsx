import { AppSidebar } from "@/components/common/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

type Props = PropsWithChildren;

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
      </SidebarInset>
      <main className=" w-full flex flex-col px-4 md:px-6 py-4" >{children}</main>
      <Toaster/>
    </SidebarProvider>
  );
}
