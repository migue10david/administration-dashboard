"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import EditSettings from './EditSettings'
import { Settings } from '@/app/lib/types/modelTypes'


interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
}

const SettingsFormModal = ({ open, onOpenChange, settings }: Props) => {
  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Editar Configuración</DialogTitle>
          <DialogDescription>Llena los campos para editar la configuración del sistema.</DialogDescription>
        </DialogHeader>
         <EditSettings onOpenChange={onOpenChange} initialData={settings} />
      </DialogContent>
    </Dialog>
  )
}

export default SettingsFormModal
