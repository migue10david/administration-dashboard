import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import RecipientForm from "./RecipientForm"

type Props = {
    onOpenChange: (open: boolean) => void
}

export function RecipientFormModal({ onOpenChange }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Crea un nuevo destinatario</DialogTitle>
        <RecipientForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}