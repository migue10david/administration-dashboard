"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companiaFormSchema, CompaniaFormValues } from "@/app/lib/schemas/companiaFormSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  compania: CompaniaFormValues & { id: string };
  onOpenChange: (open: boolean) => void;
};

export default function EditCompaniaForm({ compania, onOpenChange }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompaniaFormValues>({
    resolver: zodResolver(companiaFormSchema),
    defaultValues: {
      name: compania.name || "",
      direccion: compania.direccion || "",
      telefono: compania.telefono || "",
      comentarios: compania.comentarios || "",
    },
  });

  const onSubmit = async (data: CompaniaFormValues) => {
    try {
      const response = await fetch(`/api/compania/${compania.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(data);
      if (!response.ok) throw new Error("Error al actualizar");

      toast.success("✅ Compañía actualizada correctamente");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("❌ No se pudo actualizar la compañía");
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
          <Label htmlFor="direccion" className="text-right">
            Dirección
          </Label>
          <Input id="direccion" type="text" placeholder="Dirección" className="col-span-3" {...register("direccion")} />
        </div>

        {/* Teléfono */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="telefono" className="text-right">
            Teléfono
          </Label>
          <Input id="telefono" type="text" placeholder="Teléfono" className="col-span-3" {...register("telefono")} required />
        </div>

        {/* Comentarios */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="comentarios" className="text-right">
            Comentarios
          </Label>
          <Input id="comentarios" type="text" placeholder="Comentarios" className="col-span-3" {...register("comentarios")} />
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