import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ClientFormState } from "@/app/lib/types/formState";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateClientForm = ({onOpenChange }: Props) => {
  const [imageUrl, setImageUrl] = useState("");

  console.log(imageUrl)

  return (
    <form  className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nombre" className="text-right">
            Nombre
          </Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Nombre completo"
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="direccion" className="text-right">
            Dirección
          </Label>
          <Input
            id="direccion"
            name="direccion"
            placeholder="Dirección"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="telefono" className="text-right">
            Teléfono
          </Label>
          <Input
            id="telefono"
            name="telefono"
            placeholder="Teléfono"
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nacionalidad" className="text-right">
            Nacionalidad
          </Label>
          <Input
            id="nacionalidad"
            name="nacionalidad"
            placeholder="Nacionalidad"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="thumbnail" className="text-right">Thumbnail</Label>
          <Input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files)
                setImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
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
