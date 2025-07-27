"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecipientForm from "./RecipientForm";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecipientFormModal({ open, onOpenChange }: Props) {


  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[700px]" onInteractOutside={(e: Event) => e.preventDefault()} onPointerDownOutside={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Beneficiario</DialogTitle>
          <DialogDescription>Llena los campos para crear un nuevo Beneficiario.</DialogDescription>
        </DialogHeader>
        <RecipientForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}