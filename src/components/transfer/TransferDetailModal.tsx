"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  senderName: string;
  recipientName: string;
};

export default function TransferDetailsModal({
  open,
  onOpenChange,
  senderName,
  recipientName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de la Transferencia</DialogTitle>
        </DialogHeader>
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Enviado por</p>
              <p className="font-medium">{senderName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recibido por</p>
              <p className="font-medium">{recipientName}</p>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}