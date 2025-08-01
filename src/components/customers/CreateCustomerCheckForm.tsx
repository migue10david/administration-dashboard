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
import { Customer, Settings, TransactionType } from "@/app/lib/types/modelTypes";
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

type Props = {
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  transactionTypes: TransactionType[];
  settings: Settings;
};

const CreateCustomerCheckForm = ({
  onOpenChange,
  customer,
  transactionTypes,
  settings
}: Props) => {
  const router = useRouter();
  const moneyOrderFeed = settings.moneyOrderFeed;
  const customerFeed = customer.percentage || 0;
  const [selectedTransactionTypeId, setSelectedTransactionTypeId] = useState<string>("");
  const [isCustomFeed, setIsCustomFeed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckFormValues>({
    resolver: zodResolver(checkFormSchema),
    defaultValues: {
      amount: 0,
      feed: 0,
      number: "",
      percent: 0,
      customerId: customer.id,
      checkTransactionTypeId: "",
    },
  });

  // Observa los valores relevantes
  const amount = watch("amount", 0);
  const percent = watch("percent", 0);
  const feed = watch("feed", 0);
  const transactionType = watch("checkTransactionTypeId");

  // Efecto para calcular el feed cuando cambian amount o percent
  useEffect(() => {
    if (!isCustomFeed) {
      const calculatedFeed = (amount * percent) / 100;
      setValue("feed", parseFloat(calculatedFeed.toFixed(2)), { shouldValidate: true });
    }
  }, [amount, percent, isCustomFeed, setValue]);

  // Calcula "A pagar"
  const totalToPay = Number(amount) - Number(feed);

  // Efecto para establecer el porcentaje inicial según el tipo de transacción
  useEffect(() => {
    if (transactionType && !isCustomFeed) {
      const selectedType = transactionTypes.find(t => t.id === transactionType);
      
      if (selectedType) {
        let newPercent = 0;
        
        if (selectedType.name.toLowerCase() === "cash check") {
          newPercent = customerFeed;
        } else if (selectedType.name.toLowerCase() === "money order") {
          newPercent = moneyOrderFeed;
        }
        
        setValue("percent", newPercent, { shouldValidate: true });
      }
    }
  }, [transactionType, customer.percentage, moneyOrderFeed, isCustomFeed, setValue, transactionTypes, customerFeed]);

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
      onOpenChange(false);
      router.refresh();
      toast.success(res.message || "Transacción guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la transacción");
      console.error(error);
    }
  };

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newPercent = isNaN(value) ? 0 : value;
    setValue("percent", newPercent, { shouldValidate: true });
    setIsCustomFeed(false); // Al cambiar el porcentaje, volvemos al cálculo automático
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-2">
        {/* Sección de información del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-gray-600">Nombre del Cliente</Label>
            <Input
              type="text"
              value={`${customer.firstName} ${customer.middleName || ""}`.trim()}
              disabled
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">Apellidos</Label>
            <Input
              type="text"
              value={`${customer.lastNameOne} ${customer.lastNameTwo || ""}`.trim()}
              disabled
              className="bg-white"
            />
          </div>
        </div>

        {/* Sección de datos del cheque */}
        <div className="space-y-4 p-4">
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.number.message}
                </p>
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
                  {...register("amount", { 
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = parseFloat(e.target.value);
                      setValue("amount", isNaN(value) ? 0 : value, { shouldValidate: true });
                    }
                  })}
                  className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Tipo de Transacción */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">
                Tipo de Transacción*
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("checkTransactionTypeId", value, { shouldValidate: true });
                  setSelectedTransactionTypeId(value);
                }}
                value={selectedTransactionTypeId}
              >
                <SelectTrigger
                  className={
                    errors.checkTransactionTypeId
                      ? "border-red-500 w-full"
                      : "w-full"
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

            {/* Porcentaje de Comisión */}
            <div className="space-y-3">
              <Label htmlFor="percent" className="text-gray-700 font-medium">
                Comisión (%)
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("percent", {
                      valueAsNumber: true,
                      onChange: handlePercentChange
                    })}
                    className={`${errors.percent ? "border-red-500" : ""}`}
                  />
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  %
                </span>
              </div>
            </div>

            {/* Comisión Calculada */}
            <div className="space-y-3">
              <Label htmlFor="feed" className="text-gray-700 font-medium">
                Comisión Calculada ($)
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={true}
                    placeholder="0.00"
                    {...register("feed", { valueAsNumber: true })}
                    className={`pl-8 ${errors.feed ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
              {errors.feed && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.feed.message}
                </p>
              )}
            </div>

            {/* Total a Pagar */}
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-medium text-lg">
                  Total a Pagar
                </Label>
                <span className="text-2xl font-bold text-green-600">
                  $
                  {isNaN(totalToPay) || totalToPay < 0
                    ? "0.00"
                    : totalToPay.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </span>
              </div>
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
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Guardar Transacción
        </Button>
      </div>
    </form>
  );
};

export default CreateCustomerCheckForm;