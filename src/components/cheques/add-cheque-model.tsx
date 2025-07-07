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
import { Cheque } from "@/data/mock-data"


interface AddChequeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCheque: (cheque: Omit<Cheque, "id">) => void
}

export function AddChequeModal({ open, onOpenChange, onAddCheque }: AddChequeModalProps) {
  const [formData, setFormData] = useState({
    numero: "",
    banco: "",
    monto: "",
    fecha: "",
    fechaVencimiento: "",
    beneficiario: "",
    concepto: "",
    estado: "Pendiente" as "Pendiente" | "Cobrado" | "Rechazado" | "Vencido",
    empresa: "",
  })

  const bancos = [
    "Banco de Crédito del Perú",
    "Interbank",
    "BBVA Continental",
    "Scotiabank",
    "Banco de la Nación",
    "Banco Pichincha",
    "Citibank",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddCheque({
      ...formData,
      monto: Number.parseFloat(formData.monto),
    })
    setFormData({
      numero: "",
      banco: "",
      monto: "",
      fecha: "",
      fechaVencimiento: "",
      beneficiario: "",
      concepto: "",
      estado: "Pendiente",
      empresa: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Cheque</DialogTitle>
          <DialogDescription>Completa la información del nuevo cheque.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero" className="text-right">
                Número
              </Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banco" className="text-right">
                Banco
              </Label>
              <Select value={formData.banco} onValueChange={(value) => setFormData({ ...formData, banco: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monto" className="text-right">
                Monto
              </Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaVencimiento" className="text-right">
                Vencimiento
              </Label>
              <Input
                id="fechaVencimiento"
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="beneficiario" className="text-right">
                Beneficiario
              </Label>
              <Input
                id="beneficiario"
                value={formData.beneficiario}
                onChange={(e) => setFormData({ ...formData, beneficiario: e.target.value })}
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
              <Label htmlFor="concepto" className="text-right">
                Concepto
              </Label>
              <Input
                id="concepto"
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
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
                onValueChange={(value: "Pendiente" | "Cobrado" | "Rechazado" | "Vencido") =>
                  setFormData({ ...formData, estado: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Cobrado">Cobrado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Cheque</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
