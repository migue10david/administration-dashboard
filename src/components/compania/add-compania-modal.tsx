"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Compania } from "@/data/mock-data"


interface AddCompaniaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCompania: (compania: Omit<Compania, "id">) => void
}

export function AddCompaniaModal({ open, onOpenChange, onAddCompania }: AddCompaniaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: "",
    sector: "",
    estado: "Activa" as "Activa" | "Inactiva",
  })

  const sectores = [
    "Tecnología",
    "Consultoría",
    "Marketing",
    "Finanzas",
    "Publicidad",
    "Construcción",
    "Salud",
    "Educación",
    "Comercio",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddCompania({
      ...formData,
      fechaCreacion: new Date().toISOString().split("T")[0],
    })
    setFormData({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      email: "",
      sector: "",
      estado: "Activa",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Compañía</DialogTitle>
          <DialogDescription>Completa la información de la nueva compañía.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ruc" className="text-right">
                RUC
              </Label>
              <Input
                id="ruc"
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sector" className="text-right">
                Sector
              </Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "Activa" | "Inactiva") => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Compañía</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
