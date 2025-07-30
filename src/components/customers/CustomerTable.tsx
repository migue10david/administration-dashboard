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
import Link from "next/link";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = {
  customers: Customer[];
};

const CustomerTable = ({ customers }: Props) => {
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
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <Link 
                    href={`/dashboard/customer/${customer.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {customer.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/dashboard/customer/${customer.id}`}
                    className="hover:underline"
                  >
                    {customer.firstName} {customer.middleName && `${customer.middleName} `}
                    {customer.lastNameOne} {customer.lastNameTwo}
                  </Link>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {format(new Date(customer.dob), 'dd/MM/yyyy', { locale: es })}
                </TableCell>
                <TableCell>{customer.dlid}</TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.isActive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {customer.isActive ? 'Activo' : 'Inactivo'}
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

export default CustomerTable;