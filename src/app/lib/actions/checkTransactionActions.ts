import { headers } from "next/headers";
import { CheckTransaction } from "../types/modelTypes";
import { filters } from "./customersActions";

export const getCheckTransactions = async (filters?: filters) => {
  const cookie = (await headers()).get("cookie");

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkTransaction`);
   if (typeof filters?.search === "string" && filters.search.trim()) {
    url.searchParams.set("search", encodeURIComponent(filters.search.trim()));
  }

  const res = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const checkTransactions = await res.json();
  return {
    data: checkTransactions.data as CheckTransaction[],
    totalPages: checkTransactions.meta.total as number,
  };
};