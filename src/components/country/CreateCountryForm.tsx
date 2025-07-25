import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  countryFormSchema,
  CountryFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateCountryForm = ({ onOpenChange }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = async (data: CountryFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/api/country", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al enviar el formulario");
      onOpenChange(false);
      toast.success("✅ Pais creado correctamente");
      router.refresh();
    } catch (error) {
      toast.error("❌ No se pudo crear el pais");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nombre" className="text-right">
            Nombre
          </Label>
          <Input
            type="text"
            placeholder="Nombre completo"
            className="col-span-3"
            {...register("name")}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="direccion" className="text-right">
            Code
          </Label>
          <Input
            type="text"
            placeholder="Code"
            className="col-span-3"
            {...register("code")}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button type="submit">Guardar Pais</Button>
      </div>
    </form>
  );
};

export default CreateCountryForm;
