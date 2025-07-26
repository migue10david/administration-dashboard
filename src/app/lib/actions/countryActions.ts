"use server";
import { headers } from "next/headers";
import { Country } from "../types/modelTypes";

export const getCountries = async (page: number, perPage: number) => {
  const cookie = (await headers()).get("cookie");
  const start = page - 1 + 1 || 1;
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country`);
  url.searchParams.set("page", String(start));
  url.searchParams.set("limit", String(perPage));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const countries = await res.json();
  return {
    data: countries.data as Country[],
    totalPages: countries.meta.total as number,
  };
};

export const getCountryById = async (id: string) => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
      },
      cache: "no-cache", // opcional, evita cache en desarrollo
    }
  );

  const country = await res.json();
  return country.data as Country;
};

export async function deleteCountry(id: string) {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
  });

  const data = await response.json();
  return data;
}
