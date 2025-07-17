"use client"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateCompaniaForm from "./CreateCompaniaForm"


interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CompaniaFormModal({ open, onOpenChange }: Props) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Compañia</DialogTitle>
          <DialogDescription>Llena los campos para crear una nueva compañia.</DialogDescription>
        </DialogHeader>
        <CreateCompaniaForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}
