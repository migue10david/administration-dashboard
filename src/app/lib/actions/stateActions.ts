import { headers } from "next/headers";
import { State } from "../types/modelTypes";

export const getStates = async () => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/state`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const states = await res.json();
  return  states.data as State[];
}; 