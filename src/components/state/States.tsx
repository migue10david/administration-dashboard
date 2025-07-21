"use client";
import {  Country, State } from "@/app/lib/types/modelTypes";
import React, { useState } from "react";
import Search from "../common/search";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import StateFormModal from "./StateFormModal";

type Props = {
  states: State[];
  countries: Country[];
};

const States = ({ states, countries }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <div className="col-span-6 font-medium text-gray-500">
            Nombre del Estado
          </div>
          <div className="col-span-3 font-medium text-gray-500">Código</div>
          <div className="col-span-3 font-medium text-gray-500">
            Código del Pais
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {states.map((state) => (
            <div
              key={state.id}
              className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-6 flex items-center">
                <span className="font-medium text-gray-800">{state.name}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {state.code}
                </span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {state.countryId ? countries.find(country => country.id === state.countryId)?.name : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal del formulario */}
      <StateFormModal open={isModalOpen} onOpenChange={setIsModalOpen} countries={countries} />
    </div>
  );
};

export default States;
