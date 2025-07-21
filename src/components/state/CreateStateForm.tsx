"use client";

import {
  stateFormSchema,
  StateFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Country } from "@/app/lib/types/modelTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  onOpenChange: (open: boolean) => void;
  countries: Country[];
};

const CreateStateForm = ({ onOpenChange, countries }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StateFormValues>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: "",
      code: "",
      countryId: "",
    },
  });

  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  const onSubmit = async (data: StateFormValues) => {
    console.log("✅ Formulario enviado:", data);

    const response = await fetch("http://localhost:3000/api/state", {
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
            placeholder="Nombre completo"
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

        {/* Código */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Código
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="Código del estado"
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

        {/* País */}
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

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Estado</Button>
      </div>
    </form>
  );
};

export default CreateStateForm;