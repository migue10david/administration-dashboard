import { headers } from "next/headers";
import { CheckTransaction } from "../types/modelTypes";

export const getCheckTransactions = async () => {
  const cookie = (await headers()).get("cookie");

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkTransaction`);

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