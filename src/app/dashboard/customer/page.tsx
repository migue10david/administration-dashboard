import { getClientes } from "@/app/lib/actions/customerActions";
import Clients from "@/components/customers/Clients";
import React from "react";

const ClientesPage = async () => {
  const clientes = await getClientes();

  return (
    <div className="space-y-4">
      <Clients clientes={clientes} />
    </div>
  );
};

export default ClientesPage;

