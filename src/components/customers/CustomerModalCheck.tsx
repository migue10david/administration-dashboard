"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateCustomerCheckForm from './CreateCustomerCheckForm'
import { Customer, TransactionType } from '@/app/lib/types/modelTypes'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  transactionTypes: TransactionType[]
}

const CustomerModalCheck = ({ open, onOpenChange,customer, transactionTypes }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Transferencia</DialogTitle>
          <DialogDescription>Confirma la transferencia de cheques</DialogDescription>
        </DialogHeader>
        <CreateCustomerCheckForm onOpenChange={onOpenChange} customer={customer} transactionTypes={transactionTypes} />
      </DialogContent>
    </Dialog>
  )
}

export default CustomerModalCheck