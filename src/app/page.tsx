"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();

  session ? redirect("/dashboard") : redirect("/auth/login");
}