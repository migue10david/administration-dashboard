"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession(); // Obtenemos el estado
  const router = useRouter(); // Hook para navegación

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirige autenticados
    } else if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirige no autenticados
    }
  }, [status, router]);

  return null; // No renderizamos nada
}