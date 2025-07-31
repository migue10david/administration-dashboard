import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { City, Recipient } from "@/app/lib/types/modelTypes";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "../ui/badge";

type Props = {
  recipients: Recipient[];
  cities: City[];
};

const RecipientTable = ({ recipients,cities }: Props) => {
  return (
    <div className="pt-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha Nac.</TableHead>
              <TableHead>Licencia</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.map((recipient) => (
              <TableRow key={recipient.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <Link 
                    href={`/dashboard/recipient/${recipient.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {recipient.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/dashboard/recipient/${recipient.id}`}
                    className="hover:underline"
                  >
                    {recipient.firstName} {recipient.middleName && `${recipient.middleName} `}
                    {recipient.lastNameOne} {recipient.lastNameTwo}
                  </Link>
                </TableCell>
                <TableCell>{recipient.phone}</TableCell>
                <TableCell>
                  {format(new Date(recipient.dob), 'dd/MM/yyyy', { locale: es })}
                </TableCell>
                <TableCell>{recipient.dlid}</TableCell>
                <TableCell>
                  <Badge 
                    variant={recipient.isActive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {recipient.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecipientTable;
