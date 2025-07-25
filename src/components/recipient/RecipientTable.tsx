import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Customer } from "@/app/lib/types/modelTypes";

type Props = {
  customers: Customer[];
};

const RecipientTable = ({ customers }: Props) => {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.firstName + ' ' + customer.lastNameOne}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.countryId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
};

export default RecipientTable;
