"use client";

import {
  Company,
  Customer,
  Recipient,
  WireTransfer,
} from "@/app/lib/types/modelTypes";
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

type Props = {
  wireTranfers: WireTransfer[];
  companies: Company[];
  customers: Customer[];
  recipients: Recipient[];
};

const WireTransfers = ({
  wireTranfers,
  companies,
  customers,
  recipients,
}: Props) => {
  const [selectedTransfer, setSelectedTransfer] = useState<WireTransfer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (transfer: WireTransfer) => {
    setSelectedTransfer(transfer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransfer(null);
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Transferencias Bancarias
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Historial de transferencias
            </p>
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {wireTranfers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                    Empresa
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
                {wireTranfers.map((wiretransfer) => {
                  // Buscar empresa y cliente
                  const company = companies.find(
                    (c) => c.id === wiretransfer.companyId
                  );
                  const customer = customers.find(
                    (c) => c.id === wiretransfer.customerId
                  );

                  return (
                    <TableRow
                      key={wiretransfer.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {company?.name || "Desconocida"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(wiretransfer.createdAt), "P", {
                            locale: es,
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          $
                          {wiretransfer.amount.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          $
                          {wiretransfer.feed.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-700">
                          $
                          {(
                            wiretransfer.amount - wiretransfer.feed
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
                          onClick={() => openModal(wiretransfer)}
                          aria-label="Ver detalles"
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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Detalles de Transferencia</DialogTitle>
              </DialogHeader>
              {selectedTransfer && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <span className="col-span-1 text-sm font-medium text-gray-500">
                      Cliente:
                    </span>
                    <span className="col-span-3 text-sm text-gray-900">
                      {customers.find(
                        (c) => c.id === selectedTransfer.customerId
                      )?.firstName +
                        " " +
                        customers.find(
                          (c) => c.id === selectedTransfer.customerId
                        )?.lastNameOne}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="col-span-1 text-sm font-medium text-gray-500">
                      Destinatario:
                    </span>
                    <span className="col-span-3 text-sm text-gray-900">
                      {recipients.find(
                        (r) => r.id === selectedTransfer.recipientId
                      )?.firstName +
                        " " +
                        recipients.find(
                          (r) => r.id === selectedTransfer.recipientId
                        )?.lastNameOne}
                    </span>
                  </div>
                </div>
              )}
              <DialogClose asChild>
                <Button type="button" variant="outline">
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
              No se encontraron transferencias bancarias registradas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WireTransfers;
