import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateStateForm from './CreateStateForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StateFormModal = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Estado</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo estado.</DialogDescription>
        </DialogHeader>
        <CreateStateForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default StateFormModal
