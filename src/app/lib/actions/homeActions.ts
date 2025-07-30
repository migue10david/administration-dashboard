import { headers } from "next/headers";

export const getSummary = async () => {
  const cookie = (await headers()).get("cookie");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/summary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
      },
      cache: "no-cache", // opcional, evita cache en desarrollo
    }
  );

  const data = await res.json();  
  return {data: data.summary};

}
