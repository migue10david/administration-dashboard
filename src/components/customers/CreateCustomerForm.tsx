"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  CreateCustomerFormSchema,
  CreateCustomerFormValues,
} from "@/app/lib/schemas/customerFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { CalendarIcon, RefreshCcw, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/app/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CountrySelect } from "../country/CountrySelect";
import { StateSelect } from "../state/StateSelect";
import { CitySelect } from "../citys/CitySelect";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onOpenChange: (open: boolean) => void;
};

const CreateCustomerForm = ({ onOpenChange }: Props) => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(CreateCustomerFormSchema),
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
    mode: "onChange",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file);
  };

  const removeFile = () => {
    setFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreateCustomerFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });

      if (file) {
        formData.append("customerPhoto", file);
      }

      const response = await fetch("/api/customer", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      setSubmitSuccess(true);
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
    <div className="space-y-4">
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Cliente creado correctamente
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error al crear el cliente: {submitError}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form.getValues());
          }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <Tabs defaultValue="personal" className="w-full">
            {/* Tabs con estilo mejorado */}
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary py-2 rounded-md transition-all"
              >
                Datos Personales
              </TabsTrigger>
              <TabsTrigger
                value="direcciones"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary py-2 rounded-md transition-all"
              >
                Dirección
              </TabsTrigger>
              <TabsTrigger
                value="observaciones"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary py-2 rounded-md transition-all"
              >
                Notas
              </TabsTrigger>
            </TabsList>

            {/* Contenido de Datos Personales */}
            <TabsContent value="personal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna izquierda - Foto */}
                <div className="space-y-6 md:col-span-1">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-center">
                        Foto del Cliente
                      </h3>
                      {file ? (
                        <div className="relative group flex flex-col items-center">
                          {file.type.startsWith("image") && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview de la foto"
                              className="w-full h-48 object-cover rounded-md border mb-2"
                            />
                          )}
                          <div className="flex gap-10 w-full">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <RefreshCcw />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={removeFile}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-dashed border-2 border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="text-center p-4">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6 text-gray-400"
                              >
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                                <line x1="16" x2="22" y1="5" y2="5" />
                                <line x1="19" x2="19" y1="2" y2="8" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-500">
                              Haz clic para subir una foto
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Formatos: JPG, PNG (max. 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  </Card>
                </div>

                {/* Columna derecha - Campos de datos personales */}
                <div className="space-y-6 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primer Nombre*</FormLabel>
                          <FormControl>
                            <Input placeholder="Primer Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segundo Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Segundo Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastNameOne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primer Apellido*</FormLabel>
                          <FormControl>
                            <Input placeholder="Primer Apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastNameTwo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segundo Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Segundo Apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono*</FormLabel>
                          <FormControl>
                            <Input placeholder="Teléfono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha Nac.*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Seleccione una Fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                                className="rounded-md border"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ssn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SSN*</FormLabel>
                          <FormControl>
                            <Input placeholder="SSN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dlid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Licencia (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Licencia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentaje*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Porcentaje"
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Código"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contenido de Dirección */}
            <TabsContent value="direcciones" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección*</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartamento (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal*</FormLabel>
                      <FormControl>
                        <Input placeholder="Código Postal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País*</FormLabel>
                      <FormControl>
                        <CountrySelect
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setSelectedCountry(value);
                            setSelectedState(""); // Reset state when country changes
                            form.setValue("stateId", ""); // Clear state field
                            form.setValue("cityId", ""); // Clear city field
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado/Provincia*</FormLabel>
                      <FormControl>
                        <StateSelect
                          countryId={selectedCountry}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setSelectedState(value);
                            form.setValue("cityId", ""); // Clear city field when state changes
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad*</FormLabel>
                      <FormControl>
                        <CitySelect
                          stateId={selectedState}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="observaciones" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ponga su nota aquí"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCustomerForm;
