"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Company, Customer, TransactionType } from '@/app/lib/types/modelTypes'
import CreateCustomerTransferForm from './CreateCustomerTransferForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  companies: Company[]
}

const CustomerModalTransfer = ({ open, onOpenChange,customer, companies }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Transferencia</DialogTitle>
          <DialogDescription>Confirma la transferencia de bancaria</DialogDescription>
        </DialogHeader>
        <CreateCustomerTransferForm onOpenChange={onOpenChange} customer={customer} companies={companies} />
      </DialogContent>
    </Dialog>
  )
}

export default CustomerModalTransfer