"use client";
import {
  wireTransferFormSchema,
  WireTransferFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import { Company, Customer, Settings } from "@/app/lib/types/modelTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RecipientSearch } from "../recipient/Serch";
import { RecipientFormModal } from "../recipient/RecipientFormModal";
import { CustomerSearch } from "../customers/Search";
import { Plus } from "lucide-react";
import CustomerFormModal from "../customers/CustomerFormModal";

type Props = {
  companies: Company[];
  settings: Settings;
};

const CreateTransactionForm = ({ companies, settings }: Props) => {
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [, setIsCustomFeed] = useState(false);
  const [, setRecipientName] = useState(""); // Estado para el nombre mostrado
  const formRef = useRef<HTMLFormElement>(null);
  const [customerFeed, setCustomerFeed] = useState(0);
  const [, setCustomerName] = useState(""); // Estado para el nombre mostrado
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
      customerId: "",
      recipientId: "",
      companyId: "",
      amount: 0,
      feed: settings.numCustomerPercentRate,
    },
    mode: "onChange",
  });

  // Observa los valores relevantes
  const amount = watch("amount", 0);
  const feed = watch("feed", 0);
  //const recipientId = watch("recipientId");

  // Calcula "A pagar"
  const totalToPay = Number(amount) - Number(feed);

  const onSubmit = async (data: WireTransferFormValues) => {
    try {
      const response = await fetch("/api/wireTransfer", {
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
      router.push("/dashboard");
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

  const handleCustomerSelect = (customer: Customer) => {
    setValue("customerId", customer.id, { shouldValidate: true });
    setCustomerName(`${customer.firstName} ${customer.lastNameOne}`);
    setCustomerFeed(customer.percentage);
    trigger("customerId"); // Dispara validación inmediata
  };

  return (
    <div className="max-w-3xl mx-auto">
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    {/* Header */}
    <div className="bg-blue-600 px-6 py-4">
      <h2 className="text-xl font-bold text-white">Transferencia Bancaria</h2>
    </div>

    {/* Formulario */}
    <form 
      className="p-6 space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      ref={formRef}
    >
      {/* Sección Cliente */}
      <div className="space-y-3">
        <Label htmlFor="recipient" className="text-gray-700 font-medium">
          Cliente*
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomerSearch
              onSelect={handleCustomerSelect}
              error={!!errors.customerId}
              onBlur={() => trigger("customerId")}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen2(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.customerId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.customerId.message || "Debe seleccionar un cliente"}
          </p>
        )}
        <CustomerFormModal
          open={isModalOpen2}
          onOpenChange={(open) => setIsModalOpen2(open)}
        />
        <input type="hidden" {...register("customerId")} />
      </div>

      {/* Sección Destinatario */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="space-y-3">
          <Label htmlFor="recipient" className="text-gray-700 font-medium">
            Destinatario*
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <RecipientSearch
                onSelect={handleRecipientSelect}
                error={!!errors.recipientId}
                onBlur={() => trigger("recipientId")}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen2(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.recipientId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recipientId.message || "Debe seleccionar un destinatario"}
            </p>
          )}
          <RecipientFormModal
            open={isModalOpen2}
            onOpenChange={(open) => {
              setIsModalOpen2(open);
              if (!open) formRef.current?.focus();
            }}
          />
          <input type="hidden" {...register("recipientId")} />
        </div>

        {/* Compañía */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Compañía*</Label>
          <Select
            onValueChange={(value) => {
              setValue("companyId", value, { shouldValidate: true });
              setSelectedCompanyId(value);
            }}
            value={selectedCompanyId}
          >
            <SelectTrigger className={errors.companyId ? "border-red-500" : ""}>
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
      </div>

      {/* Montos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cantidad */}
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-gray-700 font-medium">
            Cantidad ($)*
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
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
              className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Comisión */}
        <div className="space-y-3">
          <Label htmlFor="feed" className="text-gray-700 font-medium">
            Comisión ($)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("feed", { valueAsNumber: true })}
              onChange={handleFeedChange}
              className={`pl-8 ${errors.feed ? "border-red-500" : ""}`}
            />
          </div>
          {errors.feed && (
            <p className="mt-1 text-sm text-red-600">{errors.feed.message}</p>
          )}
        </div>
      </div>

      {/* Total a Pagar */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <Label className="text-gray-700 font-medium text-lg">
            Total a Pagar
          </Label>
          <span className="text-2xl font-bold text-green-600">
            ${isNaN(totalToPay) || totalToPay < 0
              ? "0.00"
              : totalToPay.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </span>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg"
        >
          Guardar Transacción
        </Button>
      </div>
    </form>
  </div>
</div>
  );
};

export default CreateTransactionForm;
