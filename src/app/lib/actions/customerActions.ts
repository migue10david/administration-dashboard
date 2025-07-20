"use server"

import { Clientes } from "../types/modelTypes";


export async function getClientes() {

    const response = await fetch("http://localhost:3000/api/customer", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data.data ;
}
