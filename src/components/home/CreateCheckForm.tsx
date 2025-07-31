"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  checkFormSchema,
  CheckFormValues,
} from "@/app/lib/schemas/checkFormSchema";
import {
  Customer,
  Settings,
  TransactionType,
} from "@/app/lib/types/modelTypes";
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
import { CustomerSearch } from "../customers/Search";
import CustomerFormModal from "../customers/CustomerFormModal";
import { Plus } from "lucide-react";

type Props = {
  transactionTypes: TransactionType[];
  settings: Settings;
};

const CreateCheckForm = ({ transactionTypes, settings }: Props) => {
  const router = useRouter();
  const [selectedTransactionTypeId, setSelectedTransactionTypeId] =
    useState<string>("");
  const [customerFeed, setCustomerFeed] = useState(0);
  const [, setCustomerName] = useState(""); // Estado para el nombre mostrado
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CheckFormValues>({
    resolver: zodResolver(checkFormSchema),
    defaultValues: {
      customerId: "",
      amount: 0,
      feed: 0,
      number: "",
      checkTransactionTypeId: "",
    },
  });

  useEffect(() => {}, []);

  // Observa los valores relevantes
  const amount = watch("amount", 0);
  const feed = watch("feed", 0);

  // Calcula "A pagar"
  const totalToPay = Number(amount) - Number(feed);

  const onSubmit = async (data: CheckFormValues) => {
   try {
     const response = await fetch("http://localhost:3000/api/checkTransaction", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    router.push("/dashboard");
    toast.success("Transacción guardada correctamente");
   }catch (error) {
     toast.error("Error al guardar transacción");
   }
  };

  const handleFeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setValue("feed", isNaN(value) ? 0 : value);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setValue("customerId", customer.id, { shouldValidate: true });
    setCustomerName(`${customer.firstName} ${customer.lastNameOne}`);
    setCustomerFeed(customer.percentage);
    trigger("customerId"); // Dispara validación inmediata
  };

  return (
<div className="px-4 py-6 min-w-5xl mx-auto">
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    {/* Header */}
    <div className="bg-blue-600 px-6 py-4">
      <h2 className="text-xl font-bold text-white">Pago de Cheque</h2>
    </div>

    {/* Formulario */}
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número de Cheque */}
          <div className="space-y-3">
            <Label htmlFor="number" className="text-gray-700 font-medium">
              Número de Cheque*
            </Label>
            <Input
              type="text"
              placeholder="Ej: 123456"
              {...register("number")}
              className={errors.number ? "border-red-500" : ""}
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
            )}
          </div>

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
                {...register("amount", { valueAsNumber: true })}
                className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Tipo de Transacción */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">
              Tipo de Transacción*
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("checkTransactionTypeId", value);
                setSelectedTransactionTypeId(value);
                setValue(
                  "feed",
                  transactionTypes.find((t) => t.id === value)?.name.toLowerCase() ===
                    "cash check"
                    ? customerFeed * 100
                    : settings.numCustomerPercentRate * 100,
                  { shouldValidate: true }
                );
              }}
              value={selectedTransactionTypeId}
            >
              <SelectTrigger
                className={
                  errors.checkTransactionTypeId ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {transactionTypes.map((transaction) => (
                    <SelectItem key={transaction.id} value={transaction.id}>
                      {transaction.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.checkTransactionTypeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.checkTransactionTypeId?.message}
              </p>
            )}
          </div>

          {/* Comisión */}
          <div className="space-y-3">
            <Label htmlFor="feed" className="text-gray-700 font-medium">
              Comisión ($)
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
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
              {selectedTransactionTypeId && (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {transactionTypes.find((t) => t.id === selectedTransactionTypeId)
                    ?.name.toLowerCase() === "cash check"
                    ? `${customerFeed}%`
                    : "Fijo"}
                </span>
              )}
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

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-2">
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
</div>
  );
};

export default CreateCheckForm;
