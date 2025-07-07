"use client"
import React, { useActionState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateClientForm from "./CreateClientForm"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ClientFormModal({ open, onOpenChange }: Props) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo cliente.</DialogDescription>
        </DialogHeader>
        <CreateClientForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}