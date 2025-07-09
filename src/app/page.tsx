"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  session ? redirect("/dashboard") : redirect("/auth/login");
}