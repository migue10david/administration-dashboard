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
import { Cliente } from "@/data/mock-data"


interface AddClienteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCliente: (cliente: Omit<Cliente, "id">) => void
}

export function AddClienteModal({ open, onOpenChange, onAddCliente }: AddClienteModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    estado: "Activo" as "Activo" | "Inactivo",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddCliente({
      ...formData,
      fechaRegistro: new Date().toISOString().split("T")[0],
    })
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      estado: "Activo",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <DialogDescription>Completa la información del nuevo cliente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="empresa" className="text-right">
                Empresa
              </Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "Activo" | "Inactivo") => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
