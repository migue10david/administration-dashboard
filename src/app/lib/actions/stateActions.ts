"use server";
import { headers } from "next/headers";
import { State } from "../types/modelTypes";

export const getStates = async (page: number, perPage: number) => {
  const cookie = (await headers()).get("cookie");
  const start = page - 1 + 1 || 1;
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/state`);
  url.searchParams.set("page", String(start));
  url.searchParams.set("limit", String(perPage));

  // Llama a tu API pasando la cookie
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const states = await res.json();
  return { data: states.data as State[], totalPages: states.meta.total as number };
};

export async function deleteState(id: string) {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/state/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
      },
    }
  );

  const data = await response.json();
  return data;
}
