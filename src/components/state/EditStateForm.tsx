"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {stateFormSchema, StateFormValues } from "@/app/lib/schemas/commonFormSchema";
import { Country } from "@/app/lib/types/modelTypes";

type Props = {
  states: StateFormValues & { id: string };
  countries: Country[];
  onOpenChange: (open: boolean) => void;
};

export default function EditStateForm({ states,countries, onOpenChange }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StateFormValues>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: states.name || "",
      code: states.code || "",
      countryId: states.countryId || "",
    },
  });
    const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  const onSubmit = async (data: StateFormValues) => {
    try {
      const response = await fetch(`/api/state/${states.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      toast.success("✅ Estado actualizada correctamente");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("❌ No se pudo actualizar el estado");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Mostrar errores si existen */}
      {Object.keys(errors).length > 0 && (
        <pre className="bg-red-100 text-red-700 p-2 rounded text-sm overflow-auto max-h-40">
          {JSON.stringify(errors, null, 2)}
        </pre>
      )}

      <div className="grid gap-4 py-4">
        {/* Nombre */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input id="name" type="text" placeholder="Nombre completo" className="col-span-3" {...register("name")} required />
        </div>

        {/* Dirección */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Codigo
          </Label>
          <Input id="code" type="text" placeholder="Dirección" className="col-span-3" {...register("code")} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="countryId" className="text-right">
            País
          </Label>
          <div className="col-span-3">
            <Select
              onValueChange={(value) => {
                setValue("countryId", value);
                setSelectedCountryId(value);
              }}
              value={selectedCountryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Paises</SelectLabel>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.countryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countryId?.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}