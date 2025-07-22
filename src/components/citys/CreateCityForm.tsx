"use client";

import {
    cityFormSchema,
    CityFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { State } from "@/app/lib/types/modelTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  onOpenChange: (open: boolean) => void;
  states: State[];
};

const CreateCityForm = ({ onOpenChange, states }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: "",
      code: "",
      stateid: "",
    },
  });

  const [selectedStateId, setSelectedStateId] = useState<string>("");

  const onSubmit = async (data: CityFormValues) => {
    console.log("✅ Formulario enviado:", data);

    const response = await fetch("http://localhost:3000/api/city", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    onOpenChange(false);
    router.refresh();

    toast(res.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 py-4">
        {/* Nombre */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Nombre de la ciudad"
            className="col-span-3"
            {...register("name")}
            required
          />
          {errors.name && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">
              {errors.name?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="codigo" className="text-right">
            Codigo
          </Label>
          <Input
            id="codigo"
            type="text"
            placeholder="Codigo"
            className="col-span-3"
            {...register("code")}
            required
          />
          {errors.code && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">
              {errors.code?.message}
            </p>
          )}
        </div>

        {/* State */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stateId" className="text-right">
            Estado
          </Label>
          <div className="col-span-3">
            <Select
              onValueChange={(value) => {
                setValue("stateid", value);
                setSelectedStateId(value);
              }}
              value={selectedStateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.stateid && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stateid?.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Ciudad</Button>
      </div>
    </form>
  );
};

export default CreateCityForm;