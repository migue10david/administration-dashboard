"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  checkFormSchema,
  CheckFormValues,
} from "@/app/lib/schemas/checkFormSchema";
import { Customer, TransactionType } from "@/app/lib/types/modelTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  transactionTypes: TransactionType[];
};


const CreateCustomerCheckForm = ({ onOpenChange, customer, transactionTypes }: Props) => {
const router = useRouter();

    const {
  register,
  handleSubmit,
  setValue,
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
const [selectedTransactionTypeId, setSelectedTransactionTypeId] = useState<string>("");

  const onSubmit = async (data: CheckFormValues) => {
    console.log("✅ Formulario enviado:", data);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nombre" className="text-right">
            Cliente
          </Label>
          <Input
            type="text"
            placeholder="Cliente"
            className="col-span-3"
            defaultValue={customer.firstName + " " + customer.middleName}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nombre" className="text-right">
            Apellido
          </Label>
          <Input
            type="text"
            placeholder="Apellido"
            className="col-span-3"
            defaultValue={customer.lastNameOne + " " + customer.lastNameTwo}
          />
        </div>
        <Input hidden type="text" value={customer.id} {...register("customerId")} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="number" className="text-right">
            No. Cheque
          </Label>
          <Input
            type="text"
            placeholder="No. Cheque"
            className="col-span-3"
            {...register("number")}
            required
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cantidad" className="text-right">
            Cantidad
          </Label>
          <Input type="text" placeholder="Cantidad" className="col-span-3" {...register("amount")} />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cashcheck" className="text-right">
            Cash check | Money order
          </Label>
         <div className="col-span-3">
            <Select
              onValueChange={(value) => {
                setValue("checkTransactionTypeId", value);
                setSelectedTransactionTypeId(value);
              }}
              value={selectedTransactionTypeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
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
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="comision" className="text-right">
            Comision
          </Label>
          <Input type="text" placeholder="Comision" className="col-span-3" {...register("feed")} />
          {errors.feed && (
            <p className="mt-1 text-sm text-red-600">{errors.feed.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="pagar" className="text-right">
            A pagar
          </Label>
          <Input type="text" placeholder="A pagar" className="col-span-3" />
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
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default CreateCustomerCheckForm;
