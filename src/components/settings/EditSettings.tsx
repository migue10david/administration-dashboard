"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  settingFormSchema,
  SettingFormValues,
} from "@/app/lib/schemas/commonFormSchema";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StateSelect } from "../state/StateSelect";
import { CitySelect } from "../citys/CitySelect";

type Props = {
  onOpenChange: (open: boolean) => void;
  // Pasa los valores iniciales desde el padre
  initialData: Partial<SettingFormValues>;
};

const EditSettings = ({ onOpenChange, initialData }: Props) => {
  const router = useRouter();
  const [selectedStateId, setSelectedStateId] = useState<string>(initialData.stateId || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingFormValues>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      name: initialData.name || "",
      code: initialData.code || "",
      cityId: initialData.cityId || "",
      stateId: initialData.stateId || "",
      zipCode: initialData.zipCode || "",
      numCustomerRate: initialData.numCustomerRate || 0,
      customerPercentRate: initialData.customerPercentRate || 0,
      moneyOrderFeed: initialData.moneyOrderFeed || 0,
      maxBankDepositLimit: initialData.maxBankDepositLimit || 0,
      minimunAge: initialData.minimunAge || 0,
    },
  });

  // Observar el estado seleccionado
  const stateId = watch("stateId");

  // Actualizar estado local cuando cambie
  React.useEffect(() => {
    if (stateId) {
      setSelectedStateId(stateId);
    }
  }, [stateId]);

  const onSubmit = async (data: SettingFormValues) => {
    try {
      const response = await fetch("/api/setting", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data)
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar configuración");
      }

      const res = await response.json();
      onOpenChange(false);
      router.refresh();
      toast.success(res.message || "✅ Configuración actualizada correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ No se pudo actualizar la configuración");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 py-4">
        {/* Nombre */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nombre"
            className="col-span-3"
            {...register("name")}
            required
          />
          {errors.name && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Code */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">Código</Label>
          <Input
            id="code"
            type="text"
            placeholder="Código"
            className="col-span-3"
            {...register("code")}
          />
        </div>

        {/* ZIP Code */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="zipCode" className="text-right">Código Postal</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Código Postal"
            className="col-span-3"
            {...register("zipCode")}
            required
          />
          {errors.zipCode && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
          )}
        </div>

        {/* State */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stateId" className="text-right">Estado</Label>
          <div className="col-span-3">
            <StateSelect
              countryId="US" // Ajusta si tienes múltiples países
              value={watch("stateId")}
              onChange={(value) => {
                setValue("stateId", value, { shouldValidate: true });
                setValue("cityId", ""); // Resetear ciudad
              }}
            />
            {errors.stateId && (
              <p className="mt-1 text-sm text-red-600">{errors.stateId.message}</p>
            )}
          </div>
        </div>

        {/* City */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cityId" className="text-right">Ciudad</Label>
          <div className="col-span-3">
            <CitySelect
              stateId={selectedStateId}
              value={watch("cityId")}
              onChange={(value) => setValue("cityId", value, { shouldValidate: true })}
            />
            {errors.cityId && (
              <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>
            )}
          </div>
        </div>

        {/* Tasas */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="numCustomerRate" className="text-right">Tarifa por cliente</Label>
          <Input
            id="numCustomerRate"
            type="number"
            step="0.01"
            placeholder="Tarifa por cliente"
            className="col-span-3"
            {...register("numCustomerRate", { valueAsNumber: true })}
            required
          />
          {errors.numCustomerRate && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.numCustomerRate.message}</p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="customerPercentRate" className="text-right">Porcentaje por cliente</Label>
          <Input
            id="customerPercentRate"
            type="number"
            step="0.01"
            placeholder="Porcentaje"
            className="col-span-3"
            {...register("customerPercentRate", { valueAsNumber: true })}
            required
          />
          {errors.customerPercentRate && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.customerPercentRate.message}</p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="moneyOrderFeed" className="text-right">Comisión Money Order</Label>
          <Input
            id="moneyOrderFeed"
            type="number"
            step="0.01"
            placeholder="Comisión"
            className="col-span-3"
            {...register("moneyOrderFeed", { valueAsNumber: true })}
            required
          />
          {errors.moneyOrderFeed && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.moneyOrderFeed.message}</p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxBankDepositLimit" className="text-right">Límite depósito bancario</Label>
          <Input
            id="maxBankDepositLimit"
            type="number"
            placeholder="Límite"
            className="col-span-3"
            {...register("maxBankDepositLimit", { valueAsNumber: true })}
            required
          />
          {errors.maxBankDepositLimit && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.maxBankDepositLimit.message}</p>
          )}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minimunAge" className="text-right">Edad mínima</Label>
          <Input
            id="minimunAge"
            type="number"
            placeholder="Edad mínima"
            className="col-span-3"
            {...register("minimunAge", { valueAsNumber: true })}
            required
          />
          {errors.minimunAge && (
            <p className="col-span-3 col-start-2 mt-1 text-sm text-red-600">{errors.minimunAge.message}</p>
          )}
        </div>
      </div>

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
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
};

export default EditSettings;