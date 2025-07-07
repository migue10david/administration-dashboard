import { Companias } from "@/app/lib/types/modelTypes";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type Props = {
  companias: Companias[];
};

const CompaniaCard = ({ companias }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companias.map((compania) => (
        <Card key={compania.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{compania.nombre}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Direccion:</span>{" "}
              {compania.direccion}
            </div>
            <div className="text-sm">
              <span className="font-medium">Teléfono:</span> {compania.telefono}
            </div>
            <div className="text-sm">
              <span className="font-medium">Comentario:</span>{" "}
              {compania.comentarios}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompaniaCard;
