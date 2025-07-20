import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { companyFormSchema, CompanyFormValues } from "@/app/lib/schemas/companyFormSchema";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateCompanyForm = ({ onOpenChange }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    console.log("✅ Formulario enviado:", data);

    const response = await fetch("http://localhost:3000/api/company", {
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
            Descripcion
          </Label>
          <Input
            type="text"
            placeholder="Dirección"
            className="col-span-3"
            {...register("description")}
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
        <Button type="submit">Guardar Compañía</Button>
      </div>
    </form>
  );
};

export default CreateCompanyForm;
