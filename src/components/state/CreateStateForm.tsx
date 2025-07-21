import {
  stateFormSchema,
  StateFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateStateForm = ({ onOpenChange }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StateFormValues>({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: "",
      code: "",
      countryId: "",
    },
  });

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
          <Label htmlFor="code" className="text-right">
            Code
          </Label>
          <Input
            type="text"
            placeholder="Code"
            className="col-span-3"
            {...register("code")}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="countryId" className="text-right">
            Pais
          </Label>
          <Input
            type="text"
            placeholder="Pais"
            className="col-span-3"
            {...register("countryId")}
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

export default CreateStateForm;
