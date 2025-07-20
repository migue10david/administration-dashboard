"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Grid, List, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Customer } from "@/app/lib/types/modelTypes";
import CustomerCard from "./CustomerCard";
import CustomerTable from "./CustomerTable";
import CustomerFormModal from "./CustomerFormModal";

type Props = {
  customers: Customer[];
};

const Customers = ({ customers }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Clientes</h2>

        {/* Botón para abrir el modal */}

        {/* Campo de búsqueda */}
        <div className="relative w-1/2 items-center gap-4">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Vista en tabla o tarjetas */}
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cliente
          </Button>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Vista condicional */}
      {viewMode === "cards" ? (
        <CustomerCard customers={customers} />
      ) : (
        <CustomerTable customers={customers} />
      )}

      {/* Modal del formulario */}
      <CustomerFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Customers;
