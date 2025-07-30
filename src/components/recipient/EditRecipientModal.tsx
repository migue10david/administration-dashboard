"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { City, Country, Recipient, State, TransactionType } from "@/app/lib/types/modelTypes";
import EditRecipientForm from "./EditRecipientForm";

type Props = {
  recipient: Recipient; // Reemplaza con tu tipo Customer
  transactionTypes: TransactionType[];
  countries: Country[];
  states: State[];
  cities: City[];
};

export default function EditRecipientModal({
  recipient,
  transactionTypes,
  countries,
  states,
  cities,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-600">
        Editar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
         <EditRecipientForm recipient={recipient} transactionTypes={transactionTypes} countries={countries} states={states} cities={cities} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}