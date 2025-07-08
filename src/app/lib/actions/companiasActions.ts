"use server"

import { Companias } from "../types/modelTypes";

export async function getCompanias(page: number, perPage: number) {

    const start = page - 1 + 1 || 1;

  const url = new URL(`http://localhost:3000/api/compania`);
  url.searchParams.set("page", String(start));
  url.searchParams.set('limit', String(perPage));

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return { companias: data.data as Companias[], total: data.meta.total as number };
}