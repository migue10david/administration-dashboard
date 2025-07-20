import React from "react";
import { mockCustomers } from "@/data/mock-data";
import Customers from "@/components/customers/Customers";

const ClientesPage = async () => {

  return (
    <div className="space-y-4">
      <Customers customers={mockCustomers} />
    </div>
  );
};

export default ClientesPage;

