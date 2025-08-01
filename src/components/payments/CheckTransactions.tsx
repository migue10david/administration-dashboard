"use client";

import { CheckTransaction, Customer } from "@/app/lib/types/modelTypes";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import Search from "../common/search";

type Props = {
  checkTransactions: CheckTransaction[];
  customers: Customer[];
};

const CheckTransactions = ({ checkTransactions, customers }: Props) => {
  const [selectedCheck, setSelectedCheck] = useState<CheckTransaction | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (check: CheckTransaction) => {
    setSelectedCheck(check);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCheck(null);
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white">
        <div className="flex flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col w-1/2">
            <h1 className="text-xl font-semibold text-gray-800">
              Transacciones con Cheque
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Historial de pagos y cobros con cheques
            </p>
          </div>
          <Search />
        </div>
      </div>

      {checkTransactions.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    N° Cheque
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                    Fecha
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Monto
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px]">
                    Comisión
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Total
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Detalles
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {checkTransactions.map((transaction) => {
                  // Buscamos el cliente asociado
                  const customer = customers.find(
                    (c) => c.id === transaction.customerId
                  );

                  return (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.number}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(transaction.createdAt), "P", {
                            locale: es,
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          $
                          {transaction.amount.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          $
                          {transaction.feed.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-700">
                          $
                          {(
                            transaction.amount - transaction.feed
                          ).toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openModal(transaction)}
                          aria-label="Ver información del pagador"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>Detalles del Pago con Cheque</DialogTitle>
    </DialogHeader>

    {selectedCheck && (
      <div className="grid gap-6 py-4">
        {/* Encabezado: Foto + Nombre */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Foto */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative h-28 w-28  overflow-hidden shadow-sm">
              <Image
                src={
                  customers.find((c) => c.id === selectedCheck.customerId)
                    ?.imageUrl || "/no-user.webp"
                }
                alt="Foto del pagador"
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/no-user.webp";
                }}
              />
            </div>
          </div>

          {/* Nombre y rol */}
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {customers.find((c) => c.id === selectedCheck.customerId)?.firstName}{" "}
              {customers.find((c) => c.id === selectedCheck.customerId)?.lastNameOne}{" "}
              {customers.find((c) => c.id === selectedCheck.customerId)?.lastNameTwo || ""}
            </h3>

            {/* Badge de porcentaje */}
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              {customers.find((c) => c.id === selectedCheck.customerId)?.percentage || 0}%
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Información Personal
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-500">Teléfono:</span>
              <span className="text-gray-900">
                {customers.find((c) => c.id === selectedCheck.customerId)?.phone || "No registrado"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-500">SSN</span>
              <span className="text-gray-900">
                {customers.find((c) => c.id === selectedCheck.customerId)?.ssn || "No registrado"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-500">Licencia:</span>
              <span className="text-gray-900">
                {customers.find((c) => c.id === selectedCheck.customerId)?.dlid || "No registrada"}
              </span>
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Dirección
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-500">Dirección:</span>
              <span className="text-gray-900 text-right">
                {customers.find((c) => c.id === selectedCheck.customerId)?.address || "No registrada"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-500">Código Postal:</span>
              <span className="text-gray-900">
                {customers.find((c) => c.id === selectedCheck.customerId)?.zipCode || "No registrado"}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <DialogClose asChild>
      <Button type="button" variant="outline" className="w-full">
        Cerrar
      </Button>
    </DialogClose>
  </DialogContent>
</Dialog>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center px-6">
          <div className="rounded-full bg-blue-50 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              No hay transacciones
            </h3>
            <p className="text-gray-500 mt-1 max-w-xs">
              No se encontraron pagos con cheque registrados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckTransactions;
