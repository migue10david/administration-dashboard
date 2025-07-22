import { headers } from "next/headers";
import { City } from "../types/modelTypes";

export const getCities = async () => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/city`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const cities = await res.json();
  return cities.data as City[];
};