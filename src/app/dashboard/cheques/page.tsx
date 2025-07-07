"use client"

import { useState } from "react"
import { Search, Grid, List, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cheque, chequesMock } from "@/data/mock-data"
import { Pagination } from "@/components/common/pagination"
import { AddChequeModal } from "@/components/cheques/add-cheque-model"



const ITEMS_PER_PAGE = 6

import React from 'react'

const ChequesPage = () => {
 const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [currentPage, setCurrentPage] = useState(1)
  const [cheques, setCheques] = useState<Cheque[]>(chequesMock)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredCheques = cheques.filter(
    (cheque) =>
      cheque.numero.includes(searchTerm) ||
      cheque.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.monto.toString().includes(searchTerm),
  )

  const totalPages = Math.ceil(filteredCheques.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCheques = filteredCheques.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAddCheque = (newCheque: Omit<Cheque, "id">) => {
    const cheque: Cheque = {
      ...newCheque,
      id: Math.max(...cheques.map((c) => c.id)) + 1,
    }
    setCheques([cheque, ...cheques])
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Cobrado":
        return "default"
      case "Pendiente":
        return "secondary"
      case "Rechazado":
        return "destructive"
      case "Vencido":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cheques</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Cheque
          </Button>
          <div className="relative w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cheques..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedCheques.map((cheque) => (
            <Card key={cheque.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">#{cheque.numero}</CardTitle>
                  <Badge variant={getEstadoBadgeVariant(cheque.estado)}>{cheque.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Banco:</span> {cheque.banco}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Monto:</span> {formatCurrency(cheque.monto)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Beneficiario:</span> {cheque.beneficiario}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Empresa:</span> {cheque.empresa}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Concepto:</span> {cheque.concepto}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Fecha:</span> {new Date(cheque.fecha).toLocaleDateString("es-ES")}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Vencimiento:</span>{" "}
                  {new Date(cheque.fechaVencimiento).toLocaleDateString("es-ES")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Beneficiario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCheques.map((cheque) => (
                <TableRow key={cheque.id}>
                  <TableCell className="font-medium">#{cheque.numero}</TableCell>
                  <TableCell>{cheque.banco}</TableCell>
                  <TableCell>{formatCurrency(cheque.monto)}</TableCell>
                  <TableCell>{cheque.beneficiario}</TableCell>
                  <TableCell>{new Date(cheque.fecha).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{new Date(cheque.fechaVencimiento).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(cheque.estado)}>{cheque.estado}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {paginatedCheques.length === 0 && filteredCheques.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron cheques que coincidan con la búsqueda.</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredCheques.length}
      />

      <AddChequeModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddCheque={handleAddCheque} />
    </div>
  )
}

export default ChequesPage

