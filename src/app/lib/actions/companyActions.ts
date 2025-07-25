"use server";

import { headers } from "next/headers";
import { Company } from "../types/modelTypes";

export const getCompanies = async () => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const companies = await res.json();
  return {
    data: companies.data as Company[],
    totalPages: companies.meta.total as number,
  };
};

export async function deleteCompany(id: string) {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
  });

  const data = await response.json();
  return data;
}
