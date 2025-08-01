import { headers } from "next/headers";
import {  WireTransfer } from "../types/modelTypes";
import { filters } from "./customersActions";

export const getWireTransfer = async (filters?: filters) => {
  const cookie = (await headers()).get("cookie");

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wireTransfer`);
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

  const wireTransfer = await res.json();
  return {
    data: wireTransfer.data as WireTransfer[],
    totalPages: wireTransfer.meta.total as number,
  };
};