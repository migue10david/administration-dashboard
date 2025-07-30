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
    const response = await fetch("http://localhost:3000/api/checkTransaction", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    router.refresh();
    toast(res.message);
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
    <div className="px-4 py-4">
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-2xl font-bold">Pago de Cheque</h2>
        <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid">
              {/* Sección de datos del cheque */}
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 gap-4">


                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-gray-600">
                      Cliente*
                    </Label>
                    <div className="flex items-center">
                      <CustomerSearch
                        onSelect={handleCustomerSelect}
                        error={!!errors.customerId}
                        onBlur={() => trigger("customerId")}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsModalOpen2(true);
                        }}
                      >
                        +
                      </Button>

                      <CustomerFormModal
                        open={isModalOpen2}
                        onOpenChange={(open) => {
                          setIsModalOpen2(open);
                        }}
                      />
                      {/* Input oculto para el ID del destinatario (manejado por react-hook-form) */}
                      <input type="hidden" {...register("customerId")} />
                    </div>
                    {errors.customerId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerId.message ||
                          "Debe seleccionar un cliente"}
                      </p>
                    )}
                  </div>

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

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      Tipo de Transacción *
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("checkTransactionTypeId", value);
                        setSelectedTransactionTypeId(value);

                        setValue("feed", transactionTypes.find((t) => t.id === value)
                          ?.name.toLowerCase() === "cash check"
                          ? customerFeed * 100
                          : settings.numCustomerPercentRate * 100,
                        { shouldValidate: true });

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
                            <SelectItem
                              key={transaction.id}
                              value={transaction.id}
                            >
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
                        className={`flex-1 ${
                          errors.feed ? "border-red-500" : ""
                        }`}
                      />
                     {selectedTransactionTypeId && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {transactionTypes.find((t) => t.id === selectedTransactionTypeId)
                          ?.name.toLowerCase() === "cash check"
                          ? `${customerFeed}%`
                          : "Fijo"}
                      </span>)}


                    </div>
                    {errors.feed && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.feed.message}
                      </p>
                    )}
                  </div>

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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
