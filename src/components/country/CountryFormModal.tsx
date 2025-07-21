"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateCountryForm from './CreateCountryForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CountryFormModal = ({ open, onOpenChange }: Props) => {
  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Pais</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo pais.</DialogDescription>
        </DialogHeader>
        <CreateCountryForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default CountryFormModal
