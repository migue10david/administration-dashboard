"use client"

import { useState } from "react"
import { Search, Grid, List, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cliente, clientesMock } from "@/data/mock-data"
import { Pagination } from "@/components/common/pagination"
import { AddClienteModal } from "@/components/clientes/add-client-modal"


const ITEMS_PER_PAGE = 6

import React from 'react'

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [currentPage, setCurrentPage] = useState(1)
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm),
  )

  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedClientes = filteredClientes.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAddCliente = (newCliente: Omit<Cliente, "id">) => {
    const cliente: Cliente = {
      ...newCliente,
      id: Math.max(...clientes.map((c) => c.id)) + 1,
    }
    setClientes([cliente, ...clientes])
    setCurrentPage(1) // Reset to first page to show the new client
  }

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Cliente
          </Button>
          <div className="relative w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
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
          {paginatedClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                  <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>{cliente.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {cliente.email}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Teléfono:</span> {cliente.telefono}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Empresa:</span> {cliente.empresa}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Registro:</span>{" "}
                  {new Date(cliente.fechaRegistro).toLocaleDateString("es-ES")}
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
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.empresa}</TableCell>
                  <TableCell>{new Date(cliente.fechaRegistro).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>{cliente.estado}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {paginatedClientes.length === 0 && filteredClientes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron clientes que coincidan con la búsqueda.</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredClientes.length}
      />

      <AddClienteModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddCliente={handleAddCliente} />
    </div>
  )
}

export default ClientesPage
