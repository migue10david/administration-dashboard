"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Customer, TransactionType } from "@/app/lib/types/modelTypes";
import { CalendarDays, DollarSign, Percent, Hash } from "lucide-react";
import CustomerModalCheck from "./CustomerModalCheck";
import { useState } from "react";

type Props = {
  customer: Customer;
  transactionTypes: TransactionType[];
};

export function CustomerTab({ customer, transactionTypes }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
   const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <Tabs defaultValue="cheque">
        <TabsList className="w-full flex justify-center bg-gray-100 p-2 rounded-lg h-12">
          <TabsTrigger 
            value="cheque" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
          >
            Transferencia de Cheque
          </TabsTrigger>
          <TabsTrigger 
            value="bancaria" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
          >
            Transferencia Bancaria
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cheque">
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      No. Cheque
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cantidad
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Comisión
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      A pagar
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Fecha
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="bg-white divide-y divide-gray-200">
                {customer.checkTransaction.map((cheque, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cheque.number}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(cheque.amount)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(cheque.feed)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(cheque.amount - cheque.feed)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cheque.createdAt.toString())}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {customer.checkTransaction.length === 0 && (
              <div className="bg-white p-8 text-center text-gray-500">
                No hay registros de cheques para este cliente
              </div>
            )}
          </div>
           <div className="pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
              Registrar Transferencia
            </Button>
            <CustomerModalCheck open={isModalOpen} onOpenChange={setIsModalOpen} customer={customer} transactionTypes={transactionTypes} />
           </div>
        </TabsContent>
        
        <TabsContent value="bancaria">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Transferencia Bancaria</CardTitle>
              <CardDescription className="text-gray-600">
                Registre las transferencias bancarias realizadas por este cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Número de Transacción</Label>
                <Input id="tabs-demo-current" type="text" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">Monto</Label>
                <Input id="tabs-demo-new" type="number" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Guardar Transacción
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}