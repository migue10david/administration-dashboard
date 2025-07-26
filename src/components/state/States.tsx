"use client";
import { Country, State } from "@/app/lib/types/modelTypes";
import React, { useState } from "react";
import Search from "../common/search";
import { Button } from "../ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import StateFormModal from "./StateFormModal";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { deleteState } from "@/app/lib/actions/stateActions";
import EditStateForm from "./EditStateForm";

type Props = {
  states: State[];
  countries: Country[];
};

const States = ({ states, countries }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [editingStateId, setEditingStateId] = useState<string | null>(null); // Estado para el modal de edición
  const [deletingStateId, setDeletingStateId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteState(id);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar compañía:", error);
    } finally {
      setDeletingStateId(null);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Estados</h2>

        <div className="relative w-1/2 items-center gap-4">
          <Search />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Estado
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
          <div className="col-span-5 font-medium text-gray-500">
            NOMBRE DEL ESTADO
          </div>
          <div className="col-span-2 font-medium text-gray-500">CODIGO</div>
          <div className="col-span-3 font-medium text-gray-500">PAIS</div>
          <div className="col-span-2 font-medium text-gray-500">ACCIONES</div>
        </div>

        <div className="divide-y divide-gray-200">
          {states.map((state) => (
            <div
              key={state.id}
              className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-5 flex items-center">
                <span className="font-medium text-gray-800">{state.name}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {state.code}
                </span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {state.countryId
                    ? countries.find(
                        (country) => country.id === state.countryId
                      )?.name
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50 border-blue-200"
                  onClick={() => setEditingStateId(state.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => setDeletingStateId(state.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
              <Dialog
                open={deletingStateId === state.id}
                onOpenChange={(open) => {
                  if (!open) setDeletingStateId(null);
                }}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogDescription>
                      Esta acción deshabilitara/habilitara el estado{" "}
                      <span className="font-semibold">{state.name}</span> de la
                      base de datos.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeletingStateId(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(state.id)}
                    >
                      Sí, eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Modal de edición */}
              <Dialog
                open={editingStateId === state.id}
                onOpenChange={(open) => {
                  if (!open) setEditingStateId(null);
                }}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar País</DialogTitle>
                  </DialogHeader>
                  <DialogContent>
                    <EditStateForm
                      countries={countries}
                      states={state}
                      onOpenChange={(open) => {
                        if (!open) setEditingStateId(null);
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
      <StateFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        countries={countries}
      />
    </div>
  );
};

export default States;
