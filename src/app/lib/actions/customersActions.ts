import { headers } from 'next/headers'
import { Customer } from '../types/modelTypes'

export type filters = {
  search?: string
}

export const getCustomers = async (filters: filters) => {
      const cookie = (await headers()).get('cookie')

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer`)

    if (typeof filters.search === 'string' && filters.search.trim()) {
    url.searchParams.set('search', encodeURIComponent(filters.search.trim()));
  }
  
  const res = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: 'no-cache', // opcional, evita cache en desarrollo
  })

  const customers = await res.json()
  return { data: customers.data as Customer[], totalPages: customers.meta.total as number }
}

export const getCustomersById = async (id:string) => {
      const cookie = (await headers()).get('cookie')

  // Llama a tu API pasando la cookie
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}), // ✅ Incluye la sesión del usuario
    },
    cache: 'no-cache', // opcional, evita cache en desarrollo
  })

  const customer = await res.json()
  return customer;
}
