"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Company } from "@/app/lib/types/modelTypes";
import { deleteCompany } from "@/app/lib/actions/companyActions";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EditCompaniaForm from "./EditCompaniaForm";

type Props = {
  companies: Company[];
};

const CompaniaTable = ({ companies }: Props) => {
  const router = useRouter();
  const [editingCompaniaId, setEditingCompaniaId] = useState<string | null>(null);
  const [deletingCompaniaId, setDeletingCompaniaId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar compañía:", error);
    } finally {
      setDeletingCompaniaId(null);
    }
  };

  return (
    <div className="pt-4">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {companies.map((compania) => (
              <TableRow key={compania.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {compania.name}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {compania.description || "Sin descripción"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {compania.isActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Activa</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-600">Inactiva</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50 border-blue-200"
                      onClick={() => setEditingCompaniaId(compania.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                      onClick={() => setDeletingCompaniaId(compania.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal de confirmación para eliminar */}
        <Dialog
          open={deletingCompaniaId !== null}
          onOpenChange={(open) => {
            if (!open) setDeletingCompaniaId(null);
          }}
        >
          <DialogContent className="sm:max-w-[425px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                ¿Estás seguro?
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Esta acción {companies.find(c => c.id === deletingCompaniaId)?.isActive ? "deshabilitará" : "habilitará"} la compañía{" "}
                <span className="font-semibold text-gray-800">
                  {companies.find(c => c.id === deletingCompaniaId)?.name}
                </span>{" "}
                de la base de datos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setDeletingCompaniaId(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deletingCompaniaId && handleDelete(deletingCompaniaId)}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de edición */}
        <Dialog
          open={editingCompaniaId !== null}
          onOpenChange={(open) => {
            if (!open) setEditingCompaniaId(null);
          }}
        >
          <DialogContent className="sm:max-w-[425px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Editar Compañía
              </DialogTitle>
            </DialogHeader>
            {editingCompaniaId && (
              <EditCompaniaForm
                company={companies.find(c => c.id === editingCompaniaId)!}
                onOpenChange={(open) => {
                  if (!open) setEditingCompaniaId(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompaniaTable;