"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Grid, List, Plus } from "lucide-react";
import { Recipient } from "@/app/lib/types/modelTypes";
import Search from "../common/search";
import RecipientCard from "./RecipientCard";
import RecipientTable from "./RecipientTable";
import { RecipientFormModal } from "./RecipientFormModal";

type Props = {
  recipients: Recipient[];
};

const Recipients = ({ recipients }: Props) => {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Beneficiarios</h2>

        {/* Botón para abrir el modal */}

        {/* Campo de búsqueda */}
        <div className="relative w-1/2 items-center gap-4">
          <Search />
        </div>

        {/* Vista en tabla o tarjetas */}
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Beneficiario
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
        <RecipientCard recipients={recipients} />
      ) : (
        <RecipientTable recipients={recipients} />
      )}

    <RecipientFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Recipients;
