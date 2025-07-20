import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Company } from "@/app/lib/types/modelTypes";

type Props = {
  companies: Company[];
};

const CompaniaTable = ({ companies }: Props) => {
  return (
    <div className="pt-4 ">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Direccion</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Comentario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((compania) => (
              <TableRow key={compania.id}>
                <TableCell className="font-medium h-16">{compania.name}</TableCell>
                <TableCell className="h-16">{compania.description}</TableCell>
                <TableCell className="h-16">{compania.name}</TableCell>
                <TableCell className="h-16">{compania.isActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniaTable;
