import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Clientes } from "@/app/lib/types/modelTypes";
import Image from "next/image";

type Props = {
  clientes: Clientes[];
};

const ClientTable = ({ clientes }: Props) => {
  return (
    <div className="pt-4">
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Nacionalidad</TableHead>
            <TableHead>DNI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>{cliente.direccion}</TableCell>
              <TableCell>{cliente.telefono}</TableCell>
              <TableCell>{cliente.nacionalidad}</TableCell>
              <TableCell>
                {" "}
                <Image
                  src={cliente.imageUrl}
                  alt="cliente"
                  width={100}
                  height={100}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
};

export default ClientTable;
