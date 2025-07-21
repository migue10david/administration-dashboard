import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateStateForm from './CreateStateForm'
import { Country } from '@/app/lib/types/modelTypes'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  countries: Country[]
}

const StateFormModal = ({ open, onOpenChange, countries }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Estado</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo estado.</DialogDescription>
        </DialogHeader>
        <CreateStateForm onOpenChange={onOpenChange} countries={countries} />
      </DialogContent>
    </Dialog>
  )
}

export default StateFormModal
