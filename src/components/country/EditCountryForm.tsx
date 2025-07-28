"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countryFormSchema, CountryFormValues } from "@/app/lib/schemas/commonFormSchema";

type Props = {
  country: CountryFormValues & { id: string };
  onOpenChange: (open: boolean) => void;
};

export default function EditCountryForm({ country, onOpenChange }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: country.name || "",
      code: country.code || "",
      
    },
  });

  const onSubmit = async (data: CountryFormValues) => {
    try {
      const response = await fetch(`/api/country/${country.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      toast.success("✅ País actualizada correctamente");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("❌ No se pudo actualizar el país");
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