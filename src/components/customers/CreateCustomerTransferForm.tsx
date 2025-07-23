"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Company, Customer } from "@/app/lib/types/modelTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  wireTransferFormSchema,
  WireTransferFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import { RecipientSearch } from "../recipient/Serch";
import { RecipientFormModal } from "../recipient/RecipientFormModal";

type Props = {
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  companies: Company[];
};

const CreateCustomerTransferForm = ({
  onOpenChange,
  customer,
  companies,
}: Props) => {
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [, setIsCustomFeed] = useState(false);
  const [, setRecipientName] = useState(""); // Estado para el nombre mostrado

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<WireTransferFormValues>({
    resolver: zodResolver(wireTransferFormSchema),
    defaultValues: {
      customerId: customer.id,
      recipientId: "",
      companyId: "",
      amount: 0,
      feed: 0,
    },
    mode: "onChange",
  });

  // Observa los valores relevantes
  const amount = watch("amount", 0);
  const feed = watch("feed", 0);
  //const recipientId = watch("recipientId");

  // Calcula "A pagar"
  const totalToPay = Number(amount) + Number(feed);

  const onSubmit = async (data: WireTransferFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/api/wireTransfer", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Datos a enviar:", data); // Para depuración
      if (!response.ok) {
        throw new Error("Error al procesar la transferencia");
      }

      const res = await response.json();
      onOpenChange(false);
      router.refresh();
      toast.success(res.message || "Transferencia realizada con éxito");
    } catch (error) {
      toast.error("Ocurrió un error al procesar la transferencia");
      console.error(error);
    }
  };

  const handleFeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setValue("feed", isNaN(value) ? 0 : value, { shouldValidate: true });
    setIsCustomFeed(true);
  };

  const handleRecipientSelect = (recipient: Customer) => {
    setValue("recipientId", recipient.id, { shouldValidate: true });
    setRecipientName(`${recipient.firstName} ${recipient.lastNameOne}`);
    trigger("recipientId"); // Dispara validación inmediata
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        {/* Sección de información del cliente */}
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-gray-600">Nombre del Cliente</Label>
            <Input
              type="text"
              value={`${customer.firstName} ${
                customer.middleName || ""
              }`.trim()}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">Apellidos</Label>
            <Input
              type="text"
              value={`${customer.lastNameOne} ${
                customer.lastNameTwo || ""
              }`.trim()}
              disabled
              className="bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Campo de búsqueda de destinatario */}

          
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-gray-600">
              Destinatario *
            </Label>
            <div className="flex items-center gap-2">
              <RecipientSearch
                onSelect={handleRecipientSelect}
                error={!!errors.recipientId}
                onBlur={() => trigger("recipientId")}
              />
              <RecipientFormModal onOpenChange={onOpenChange} />
              {errors.recipientId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.recipientId.message ||
                    "Debe seleccionar un destinatario"}
                </p>
              )}
              {/* Input oculto para el ID del destinatario (manejado por react-hook-form) */}
              <input type="hidden" {...register("recipientId")} />
            </div>
          </div>

          {/* Sección de datos de la transferencia */}
          <div className="space-y-2 p-2">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-600">
                  Cantidad ($) *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount", {
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = parseFloat(e.target.value);
                      setValue("amount", isNaN(value) ? 0 : value, {
                        shouldValidate: true,
                      });
                    },
                  })}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-600">Compañía *</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("companyId", value, { shouldValidate: true });
                      setSelectedCompanyId(value);
                    }}
                    value={selectedCompanyId}
                  >
                    <SelectTrigger
                      className={errors.companyId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Seleccione una compañía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.companyId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feed" className="text-gray-600">
                    Comisión ($)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("feed", { valueAsNumber: true })}
                      onChange={handleFeedChange}
                      className={`flex-1 ${
                        errors.feed ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.feed && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.feed.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-600">Total a Pagar ($)</Label>
                  <Input
                    type="text"
                    value={
                      isNaN(totalToPay) || totalToPay < 0
                        ? "0.00"
                        : totalToPay.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                    }
                    disabled
                    className="bg-gray-100 font-semibold text-green-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!isValid}
            >
              Guardar Transacción
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateCustomerTransferForm;
