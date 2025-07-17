"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Grid, List, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import CompaniaCard from "./CompaniaCard";
import CompaniaTable from "./CompaniaTable";
import { Companias } from "@/app/lib/types/modelTypes";
import CompaniaFormModal from "./CompaniaFormModal";

type Props = {
  companias: Companias[];
};

const Companies = ({ companias }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Compañías</h2>
        <div className="relative w-1/2 items-center gap-4">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Cambiar de grid a lista y viceversa */}
        <div className="flex items-center  gap-4">
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Agregar Compañía
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
        {/* Cambiar de grid a lista y viceversa */}
      </div>
      {viewMode === "cards" ? (
        <CompaniaCard companias={companias} />
      ) : (
        <CompaniaTable companias={companias} />
      )}
      <CompaniaFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Companies;
