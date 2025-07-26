"use server";
import { headers } from "next/headers";
import { City } from "../types/modelTypes";

export const getCities = async (page?: number, perPage?: number) => {
  const cookie = (await headers()).get("cookie");
  const start = page ? page - 1 + 1 : 1;
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/city`);
  if(page){
    url.searchParams.set("page", String(start));
    url.searchParams.set("limit", String(perPage));
  }

  // Llama a tu API pasando la cookie
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const cities = await res.json();
  return {data:cities.data as City[], totalPages: cities.meta.total as number};
};

export async function deleteCity(id: string) {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/city/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
  });

  const data = await response.json();
  return data;
}