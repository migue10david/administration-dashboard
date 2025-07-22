import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  CreateCustomerFormSchema,
  CreateCustomerFormValues,
} from "@/app/lib/schemas/customerFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateCustomerForm = ({ onOpenChange }: Props) => {
  const [file, setFile] = useState<File>();
  const [, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(CreateCustomerFormSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      firstName: "",
      middleName: "",
      lastNameOne: "",
      lastNameTwo: "",
      address: "",
      apartment: "",
      zipCode: "",
      phone: "",
      dob: new Date(),
      ssn: "",
      dlid: "",
      percentage: 0,
      notes: "",
      countryId: "",
      stateId: "",
      cityId: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file);
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const onSubmit = async (data: CreateCustomerFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      // Agregar campos del formulario
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });

      console.log("File:", file);

      // Agregar foto
      if (file) {
        formData.append("customerPhoto", file);
      }

      const response = await fetch("/api/customer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      const result = await response.json();
      console.log("Success:", result);
      setSubmitSuccess(true);
      reset();
      setFile(undefined);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {"Cliente creado correctamente"}
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {"Error al crear el cliente"}
        </div>
      )}

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
  {/* Campos en 2 columnas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    {/* Columna izquierda */}
    <div className="space-y-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-sm text-left font-medium">
          Primer Nombre
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Primer Nombre" {...register("firstName")} />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="middleName" className="text-left text-sm font-medium">
          Segundo Nombre
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Segundo Nombre" {...register("middleName")} />
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastNameOne" className="text-left text-sm font-medium">
          Primer Apellido
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Primer Apellido" {...register("lastNameOne")} />
          {errors.lastNameOne && (
            <p className="mt-1 text-sm text-red-600">{errors.lastNameOne.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastNameTwo" className="text-left text-sm font-medium">
          Segundo Apellido
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Segundo Apellido" {...register("lastNameTwo")} />
          {errors.lastNameTwo && (
            <p className="mt-1 text-sm text-red-600">{errors.lastNameTwo.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-left text-sm font-medium">
          Dirección
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Dirección" {...register("address")} />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="apartment" className="text-left text-sm font-medium">
          Apartamento
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Apartamento" {...register("apartment")} />
        </div>
      </div>
    </div>

    {/* Columna derecha */}
    <div className="space-y-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="zipCode" className="text-left text-sm font-medium">
          Código Postal
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Código Postal" {...register("zipCode")} />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-left text-sm font-medium">
          Teléfono
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Teléfono" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dob" className="text-left text-sm font-medium">
          Fecha de Nacimiento
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Fecha de Nacimiento" {...register("dob")} />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ssn" className="text-left text-sm font-medium">
          SSN
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="SSN" {...register("ssn")} />
          {errors.ssn && (
            <p className="mt-1 text-sm text-red-600">{errors.ssn.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dlid" className="text-left text-sm font-medium">
          Licencia
        </Label>
        <div className="col-span-3">
          <Input type="text" placeholder="Licencia" {...register("dlid")} />
          {errors.dlid && (
            <p className="mt-1 text-sm text-red-600">{errors.dlid.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="percentage" className="text-left text-sm font-medium">
          Porcentaje
        </Label>
        <div className="col-span-3">
          <Input
            type="number"
            placeholder="Porciento"
            {...register("percentage", { valueAsNumber: true })}
          />
          {errors.percentage && (
            <p className="mt-1 text-sm text-red-600">{errors.percentage.message}</p>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Campo de imagen */}
  <div className="mt-8">
    <Label className="text-sm font-medium">Foto</Label>
    <div className="grid grid-cols-1 gap-4 mt-2">
      <div className="relative group flex items-center justify-center border-dashed border-2 border-gray-300 rounded-md p-3">
        {file?.type.startsWith("image") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={URL.createObjectURL(file)}
            alt="Preview de la foto"
            className="w-full h-60 object-cover rounded border"
          />
        )}
        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &times;
          </button>
        )}
      </div>

      <div
        className={`relative border-dashed border-2 border-gray-300 rounded-md h-60 flex items-center justify-center cursor-pointer ${
          file ? "hidden" : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="text-gray-500 text-center">Adjuntar foto</span>
      </div>

      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  </div>

  {/* Botones */}
  <div className="flex justify-end gap-4 pt-6">
    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
      Cancelar
    </Button>
    <Button type="submit">Guardar Cliente</Button>
  </div>
</form>
    </>
  );
};

export default CreateCustomerForm;
