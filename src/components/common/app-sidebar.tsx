"use client";

import type * as React from "react";
import { Building2, DoorOpen, FileText, Flag, Home, Settings, Star, Users, Users2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const navigationItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Clientes",
    url: "/customer",
    icon: Users,
  },
  {
    title: "Beneficiarios",
    url: "/recipient",
    icon: Users2,
  },
  {
    title: "Compañías",
    url: "/companies",
    icon: Building2,
  },
  {
    title: "Paises",
    url: "/country",
    icon: Flag
  },
  {
    title: "Estados",
    url: "/state",
    icon: Star
  },
  {
    title: "Ciudades",
    url: "/city",
    icon: FileText
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession()
  console.log(session)
  return (
    <Sidebar {...props} className="bg-gray-50 border-r border-gray-200">
      <SidebarHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="text-white hover:bg-gradient-to-r from-blue-600 to-blue-800 hover:text-white">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Mi Dashboard</span>
                  <span className="text-xs opacity-80">Sistema de Gestión</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
             {session.data?.user?.role === "ADMIN" ? (
               navigationItems.map((item) => (
                 <SidebarMenuItem key={item.title} className="px-2">
                   <SidebarMenuButton className="h-12 px-4 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                     <Link
                       href={`/dashboard/${item.url}`}
                       className="flex items-center gap-3 w-full"
                     >
                       <item.icon className="h-5 w-5" />
                       <span>{item.title}</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))
             ) : (
               <SidebarMenuItem className="px-2">
                 <SidebarMenuButton className="h-12 px-4 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                   <Link
                     href={`/dashboard/customer`}
                     className="flex items-center gap-3 w-full"
                   >
                     <Users className="h-5 w-5" />
                     <span>Clientes</span>
                   </Link>
                 </SidebarMenuButton>
                 <SidebarMenuButton className="h-12 px-4 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                   <Link
                     href={`/dashboard/recipient`}
                     className="flex items-center gap-3 w-full"
                   >
                     <Users2 className="h-5 w-5" />
                     <span>Beneficiarios</span>
                   </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
             )}
              <SidebarMenuItem className="px-2 mt-4">
                <button
                  className="w-full h-12 px-4 text-base text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors duration-200"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  <DoorOpen className="h-5 w-5" />
                  <span>Salir</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}