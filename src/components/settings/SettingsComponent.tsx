"use client"
import { City, Settings, State } from "@/app/lib/types/modelTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import SettingsFormModal from "./SettingsFormModal";
import { useState } from "react";

type Props = {
  settings: Settings;
  cities: City[];
  states: State[];
};

const SettingsComponent = ({ settings, cities, states }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Configuración del Sistema</h1>
        <Button onClick={() => setIsModalOpen(true)}>Editar</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Nombre
              </h3>
              <p className="text-lg font-semibold">{settings.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Código
              </h3>
              <p className="text-lg font-semibold">{settings.code}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Ubicación
              </h3>
              <p className="text-lg font-semibold">
                {settings.zipCode},{" "}
                {cities.find((city) => city.id === settings.cityId)?.name},{" "}
                {states.find((state) => state.id === settings.stateId)?.name}
              </p>
            </div>
          </div>

          <Separator className="md:hidden" />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tasas y Porcentajes
              </h3>
              <div className="mt-2 space-y-2">
                <p>Porcentaje cliente: {settings.customerPercentRate}%</p>
                <p>
                  Número cliente porcentaje: {settings.numCustomerPercentRate}
                </p>
                <p>Comisión giros: ${settings.moneyOrderFeed.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Límites
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  Límite máximo depósito: $
                  {settings.maxBankDepositLimit.toFixed(2)}
                </p>
                <p>Edad mínima: {settings.minimunAge} años</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
            <SettingsFormModal open={isModalOpen} onOpenChange={setIsModalOpen} settings={settings} />
    </div>
  );
};

export default SettingsComponent;
