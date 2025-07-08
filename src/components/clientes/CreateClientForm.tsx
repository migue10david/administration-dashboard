import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { clientFormSchema, ClientFormValues } from "@/app/lib/schemas/clientFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateClientForm = ({onOpenChange }: Props) => {

  const [file, setFile] = useState<File>();
  const {register,handleSubmit,formState: {errors}} = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
      nacionalidad: "",
      imageUrl: "",
    }
  });

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  setFile(file);
};

const onSubmit = async (data: ClientFormValues) => {
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
            {...register("nombre")}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="direccion" className="text-right">
            Dirección
          </Label>
          <Input
            type="text"
            placeholder="Dirección"
            className="col-span-3"
            {...register("direccion")}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="telefono" className="text-right">
            Teléfono
          </Label>
          <Input

            type="text"
            placeholder="Teléfono"
            className="col-span-3"
            {...register("telefono")}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nacionalidad" className="text-right">
            Nacionalidad
          </Label>
          <Input
            type="text"
            placeholder="Nacionalidad"
            className="col-span-3"
            {...register("nacionalidad")}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="thumbnail" className="text-right">Dni Imagen</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
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
        <Button type="submit">Guardar Cliente</Button>
        
      </div>
    </form>
  );
};

export default CreateClientForm;
