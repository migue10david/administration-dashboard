import { headers } from "next/headers";
import { Customer } from "../types/modelTypes";

export const getRecipients = async () => {
  const cookie = (await headers()).get("cookie");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipient`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: "no-cache", // opcional, evita cache en desarrollo
  });

  const recipients = await res.json();
  return {data:recipients.data as Customer[], totalPages: recipients.total as number};
};

export const getRecipientById = async (id: string) => {
  const cookie = (await headers()).get("cookie");

  // Llama a tu API pasando la cookie
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipient/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
      },
      cache: "no-cache", // opcional, evita cache en desarrollo
    }
  );

  const recipient = await res.json();
  return recipient;
};
