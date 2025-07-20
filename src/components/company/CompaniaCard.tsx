"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteCompania } from "@/app/lib/actions/companyActions";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EditCompaniaForm from "./EditCompaniaForm"; // Importa el formulario de edición
import { Company } from "@/app/lib/types/modelTypes";


type Props = {
  companies: Company[];
};

export default function CompaniaCard({ companies }: Props) {
  const router = useRouter();
  const [editingCompaniaId, setEditingCompaniaId] = useState<string | null>(null); // Estado para el modal de edición
  const [deletingCompaniaId, setDeletingCompaniaId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteCompania(id);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar compañía:", error);
    } finally {
      setDeletingCompaniaId(null);
    }
  };

  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((compania) => (
        <div key={compania.id}>
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{compania.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 relative">
              <div className="text-sm">
                <span className="font-medium">Descripcion:</span> {compania.description}
              </div>
              <div className="text-sm">
                <span className="font-medium">Nombre:</span> {compania.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Activa:</span> {compania.isActive === true ? "Si" : "No"}
              </div>

              {/* Botones de acción */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => setEditingCompaniaId(compania.id)} // Abrir modal de edición
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => setDeletingCompaniaId(compania.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modal de confirmación de eliminación */}
          <Dialog
            open={deletingCompaniaId === compania.id}
            onOpenChange={(open) => {
              if (!open) setDeletingCompaniaId(null);
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente la compañía{" "}
                  <span className="font-semibold">{compania.name}</span> de la base de datos.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeletingCompaniaId(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(compania.id)}
                >
                  Sí, eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de edición */}
          <Dialog
            open={editingCompaniaId === compania.id}
            onOpenChange={(open) => {
              if (!open) setEditingCompaniaId(null);
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Compañía</DialogTitle>
              </DialogHeader>
              <DialogContent>
                <EditCompaniaForm
                  company={compania}
                  onOpenChange={(open) => {
                    if (!open) setEditingCompaniaId(null);
                  }}
                />
              </DialogContent>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}