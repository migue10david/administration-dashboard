import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { State } from '@/app/lib/types/modelTypes'
import CreateCityForm from './CreateCityForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  states: State[]
}

const CityFormModal = ({ open, onOpenChange, states }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Ciudad</DialogTitle>
          <DialogDescription>Llena los campos para crear una nueva ciudad.</DialogDescription>
        </DialogHeader>
        <CreateCityForm onOpenChange={onOpenChange} states={states} />
      </DialogContent>
    </Dialog>
  )
}

export default CityFormModal
