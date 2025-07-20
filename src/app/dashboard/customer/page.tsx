import Customers from "@/components/customers/Customers";
import React from "react";
import { headers } from 'next/headers'

const ClientesPage = async () => {
  // Obtén las cookies del cliente
  const cookie = (await headers()).get('cookie')

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: 'no-cache', // opcional, evita cache en desarrollo
  })

  const customers = await res.json()

  if (!res.ok) {
    throw new Error(customers.error || 'No se pudieron cargar los clientes')
  }

  return (
    <div className="space-y-4">
      <Customers customers={customers.data} />
    </div>
  );
};

export default ClientesPage;

