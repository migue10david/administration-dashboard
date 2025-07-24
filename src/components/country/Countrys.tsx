"use client";
import React, { useState } from "react";
import Search from "../common/search";
import { Country } from "@/app/lib/types/modelTypes";
import CountryFormModal from "./CountryFormModal";
import { Button } from "../ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
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
            Nombre del País
          </div>
          <div className="col-span-2 font-medium text-gray-500">Código</div>
          <div className="col-span-2 font-medium text-gray-500">Botones</div>
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
              <div className="col-span-2 flex items-center gap-2">
                <Button
                  onClick={() => setDeletingCountryId(country.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setEditingCountryId(country.id)}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Pencil className="h-4 w-4" />
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
