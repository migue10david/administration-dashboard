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
  const [selectedTransactionTypeId, setSelectedTransactionTypeId] =
    useState<string>("");
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
      customerId: "",
      checkTransactionTypeId: "",
    },
  });

  useEffect(() => {
    if (customer?.id) {
      setValue("customerId", customer.id);
    }
  }, [customer, setValue]);

  // Observa los valores relevantes
  const amount = watch("amount", 0);
  const feed = watch("feed", 0);
  const transactionType = watch("checkTransactionTypeId");

  // Calcula "A pagar"
  const totalToPay = Number(amount) + Number(feed);

  // Efecto para actualizar la comisión según el tipo de transacción
  useEffect(() => {
    if (!isCustomFeed && transactionType) {
      const selectedType = transactionTypes.find(
        (t) => t.id === transactionType
      );
      console.log(selectedType);

      if (
        selectedType?.name.toLowerCase() === "cash check" &&
        customer?.percentage
      ) {
        const calculatedFeed = (amount * customer.percentage) / 100;
        setValue("feed", parseFloat(calculatedFeed.toFixed(2)));
      } else if (selectedType?.name.toLowerCase() === "money order") {
        const calculatedMoneyFeed = (amount * moneyOrderFeed)/ 100;
        setValue("feed", parseFloat(calculatedMoneyFeed.toFixed(2)));
      }
    }
  }, [
    transactionType,
    amount,
    customer?.percentage,
    setValue,
    transactionTypes,
    isCustomFeed,
  ]);

  const onSubmit = async (data: CheckFormValues) => {
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
    toast(res.message);
  };

  const handleFeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setValue("feed", isNaN(value) ? 0 : value);
    setIsCustomFeed(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        {/* Sección de información del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
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

        {/* Sección de datos del cheque */}
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-gray-600">
                No. Cheque *
              </Label>
              <Input
                type="text"
                placeholder="Ingrese el número de cheque"
                {...register("number")}
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-600">
                Cantidad ($) *
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600">Tipo de Transacción *</Label>
              <Select
                onValueChange={(value) => {
                  setValue("checkTransactionTypeId", value);
                  setSelectedTransactionTypeId(value);
                  setIsCustomFeed(false);
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
                  className={`flex-1 ${errors.feed ? "border-red-500" : ""}`}
                />
                {!isCustomFeed && selectedTransactionTypeId && (
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {transactionTypes
                      .find((t) => t.id === selectedTransactionTypeId)
                      ?.name.toLowerCase() === "cash check"
                      ? `${customer?.percentage}%`
                      : "Fijo"}
                  </span>
                )}
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
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Guardar Transacción
        </Button>
      </div>
    </form>
  );
};

export default CreateCustomerCheckForm;
