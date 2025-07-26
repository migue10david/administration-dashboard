"use client";
import React, { useState } from "react";
import Search from "../common/search";
import { Country } from "@/app/lib/types/modelTypes";
import CountryFormModal from "./CountryFormModal";
import { Button } from "../ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { deleteCountry } from "@/app/lib/actions/countryActions";
import EditCountryForm from "./EditCountryForm";

type Props = {
  country: Country[];
};

const Countrys = ({ country }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null); // Estado para el modal de edición
  const [deletingCountryId, setDeletingCountryId] = useState<string | null>(
    null
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteCountry(id);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar compañía:", error);
    } finally {
      setDeletingCountryId(null);
    }
  };
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Paises</h2>

        <div className="relative w-1/2 items-center gap-4">
          <Search />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar País
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
          <div className="col-span-8 font-medium text-gray-500">
            NOMBRE DEL PAIS
          </div>
          <div className="col-span-2 font-medium text-gray-500">CODIGO</div>
          <div className="col-span-2 font-medium text-gray-500">ACCIONES</div>
        </div>

        <div className="divide-y divide-gray-200">
          {country.map((country) => (
            <div
              key={country.id}
              className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-8 flex items-center">
                <span className="font-medium text-gray-800">
                  {country.name}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {country.code}
                </span>
              </div>
               <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50 border-blue-200"
                  onClick={() => setEditingCountryId(country.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => setDeletingCountryId(country.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
              <Dialog
                open={deletingCountryId === country.id}
                onOpenChange={(open) => {
                  if (!open) setDeletingCountryId(null);
                }}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogDescription>
                      Esta acción deshabilitara/habilitara el pais{" "}
                      <span className="font-semibold">{country.name}</span> de
                      la base de datos.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeletingCountryId(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(country.id)}
                    >
                      Sí, eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Modal de edición */}
              <Dialog
                open={editingCountryId === country.id}
                onOpenChange={(open) => {
                  if (!open) setEditingCountryId(null);
                }}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar País</DialogTitle>
                  </DialogHeader>
                  <DialogContent>
                    <EditCountryForm
                      country={country}
                      onOpenChange={(open) => {
                        if (!open) setEditingCountryId(null);
                      }}
                    />
                  </DialogContent>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* Modal del formulario */}
      <CountryFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Countrys;
