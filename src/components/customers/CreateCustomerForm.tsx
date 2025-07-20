import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  CustomerFormSchema,
  CustomerFormValues
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
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerFormSchema),
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
      percentage: "",
      notes: "",
      countryId: "",
      stateId: "",
      cityId: ""
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file);
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const onSubmit = async (data: CustomerFormValues) => {
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Primer Nombre
            </Label>
            <Input
              type="text"
              placeholder="Primer Nombre"
              className="col-span-3"
              {...register("firstName")}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="middleName" className="text-right">
              Segundo Nombre
            </Label>
            <Input
              type="text"
              placeholder="Segundo Nombre"
              className="col-span-3"
              {...register("middleName")}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastNameOne" className="text-right">
              Primer Apellido
            </Label>
            <Input
              type="text"
              placeholder="Primer Apellido"
              className="col-span-3"
              {...register("lastNameOne")}
              required
            />
            {errors.lastNameOne && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastNameOne.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastNameTwo" className="text-right">
              Segundo Apellido
            </Label>
            <Input
              type="text"
              placeholder="Segundo Apellido"
              className="col-span-3"
              {...register("lastNameTwo")}
              required
            />
            {errors.lastNameTwo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastNameTwo.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Dirección
            </Label>
            <Input
              type="text"
              placeholder="Dirección"
              className="col-span-3"
              {...register("address")}
              required
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Apartamento
            </Label>
            <Input
              type="text"
              placeholder="Apartamento"
              className="col-span-3"
              {...register("apartment")}
            />
          </div>



          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Código Postal
            </Label>
            <Input
              type="text"
              placeholder="Código Postal"
              className="col-span-3"
              {...register("zipCode")}
              required
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.zipCode.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              type="text"
              placeholder="Teléfono"
              className="col-span-3"
              {...register("phone")}
              required
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Fecha de Nacimiento
            </Label>
            <Input
              type="text"
              placeholder="Fecha de Nacimiento"
              className="col-span-3"
              {...register("dob")}
              required
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dob.message}
              </p>
            )}
          </div>



          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              SSN
            </Label>
            <Input
              type="text"
              placeholder="SSN"
              className="col-span-3"
              {...register("ssn")}
              required
            />
            {errors.ssn && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ssn.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Licencia
            </Label>
            <Input
              type="text"
              placeholder="Licencia"
              className="col-span-3"
              {...register("dlid")}
              required
            />
            {errors.dlid && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dlid.message}
              </p>
            )}
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Porcentaje
            </Label>
            <Input
              type="number"
              placeholder="Porciento"
              className="col-span-3"
              {...register("percentage", { valueAsNumber: true })}
              required
            />
            {errors.percentage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.percentage.message}
              </p>
            )}
          </div>



          <div className="flex flex-col gap-2 px-3 py-3 border-dashed border-2 border-gray-300 rounded-md">
            <Label>Foto</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative group flex items-center justify-center">
                {file?.type.startsWith("image") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview de la foto`}
                    className="w-full h-32 object-cover rounded border"
                  />
                )}
                {file && (
                <button
                  type="button"
                  onClick={() => removeFile()}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
                )}
              </div>

              {/* Botón para añadir más */}
              <div
                className={`border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32 ${
                  file ? "hidden" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-gray-500">{"Adjuntar foto"}</span>
              </div>
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
    </>
  );
};

export default CreateCustomerForm;
