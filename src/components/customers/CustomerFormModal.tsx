"use client"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateClientForm from "./CreateCustomerForm"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CustomerFormModal({ open, onOpenChange }: Props) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo cliente.</DialogDescription>
        </DialogHeader>
        <CreateClientForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}