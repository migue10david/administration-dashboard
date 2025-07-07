"use client"

import { useState } from "react"
import { Search, Grid, List, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Compania, companiasMock } from "@/data/mock-data"
import { Pagination } from "@/components/common/pagination"
import { AddCompaniaModal } from "@/components/compania/add-compania-modal"


const ITEMS_PER_PAGE = 6

import React from 'react'

const CompaniasPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [currentPage, setCurrentPage] = useState(1)
  const [companias, setCompanias] = useState<Compania[]>(companiasMock)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredCompanias = companias.filter(
    (compania) =>
      compania.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compania.ruc.includes(searchTerm) ||
      compania.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compania.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compania.direccion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCompanias.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCompanias = filteredCompanias.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAddCompania = (newCompania: Omit<Compania, "id">) => {
    const compania: Compania = {
      ...newCompania,
      id: Math.max(...companias.map((c) => c.id)) + 1,
    }
    setCompanias([compania, ...companias])
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compañías</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Compañía
          </Button>
          <div className="relative w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar compañías..."
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
          {paginatedCompanias.map((compania) => (
            <Card key={compania.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{compania.nombre}</CardTitle>
                  <Badge variant={compania.estado === "Activa" ? "default" : "secondary"}>{compania.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">RUC:</span> {compania.ruc}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sector:</span> {compania.sector}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {compania.email}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Teléfono:</span> {compania.telefono}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Dirección:</span> {compania.direccion}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Creación:</span>{" "}
                  {new Date(compania.fechaCreacion).toLocaleDateString("es-ES")}
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
                <TableHead>RUC</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompanias.map((compania) => (
                <TableRow key={compania.id}>
                  <TableCell className="font-medium">{compania.nombre}</TableCell>
                  <TableCell>{compania.ruc}</TableCell>
                  <TableCell>{compania.sector}</TableCell>
                  <TableCell>{compania.email}</TableCell>
                  <TableCell>{compania.telefono}</TableCell>
                  <TableCell>
                    <Badge variant={compania.estado === "Activa" ? "default" : "secondary"}>{compania.estado}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {paginatedCompanias.length === 0 && filteredCompanias.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron compañías que coincidan con la búsqueda.</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredCompanias.length}
      />

      <AddCompaniaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddCompania={handleAddCompania} />
    </div>
  )
}

export default CompaniasPage

