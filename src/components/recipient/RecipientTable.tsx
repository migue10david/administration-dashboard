import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Recipient } from "@/app/lib/types/modelTypes";

type Props = {
  recipients: Recipient[];
};

const RecipientTable = ({ recipients }: Props) => {
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
          {recipients.map((recipient) => (
            <TableRow key={recipient.id}>
              <TableCell className="font-medium">{recipient.firstName + ' ' + recipient.lastNameOne}</TableCell>
              <TableCell>{recipient.address}</TableCell>
              <TableCell>{recipient.phone}</TableCell>
              <TableCell>{recipient.countryId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
};

export default RecipientTable;
