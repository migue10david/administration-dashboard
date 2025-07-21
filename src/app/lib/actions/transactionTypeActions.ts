import { headers } from "next/headers";
import { TransactionType } from "../types/modelTypes";

export const getTransactionTypes = async () => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactionType`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const transactionTypes = await res.json();
  return  transactionTypes.data as TransactionType[];
}; 