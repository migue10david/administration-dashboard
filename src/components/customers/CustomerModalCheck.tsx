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
import { Customer, Settings, TransactionType } from '@/app/lib/types/modelTypes'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  transactionTypes: TransactionType[]
  settings: Settings
}

const CustomerModalCheck = ({ open, onOpenChange,customer, transactionTypes, settings }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Transferencia</DialogTitle>
          <DialogDescription>Confirma la transferencia de cheques</DialogDescription>
        </DialogHeader>
        <CreateCustomerCheckForm onOpenChange={onOpenChange} customer={customer} transactionTypes={transactionTypes} settings={settings} />
      </DialogContent>
    </Dialog>
  )
}

export default CustomerModalCheck