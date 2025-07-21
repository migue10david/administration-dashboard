"use server"
import { headers } from "next/headers";
import { Country } from "../types/modelTypes";

export const getCountries = async () => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const countries = await res.json();
  return  countries.data as Country[];
}; 

export const getCountryById = async (id: string) => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/country/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const country = await res.json();
  return  country.data as Country;
}; 