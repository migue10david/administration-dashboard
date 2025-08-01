'use client'; // Add this at the top of the file

import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

type Props = PropsWithChildren;

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider 
      defaultOpen={true} // Ensure same initial state on server and client
    >
      <AppSidebar />
      <main className="w-full flex flex-col gap-6">{children}</main>
      <Toaster position="top-right" /> {/* Add fixed position */}
    </SidebarProvider>
  );
}
