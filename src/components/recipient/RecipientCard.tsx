import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Customer, Recipient } from '@/app/lib/types/modelTypes'
import Link from 'next/link'

type Props = {
    recipients: Recipient[]
}

const RecipientCard = ({ recipients }: Props) => {
  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipients.map((recipient) => (
          <Link key={recipient.id} href={`/dashboard/recipient/${recipient.id}`}>
            <Card key={recipient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{recipient.firstName + ' ' + recipient.lastNameOne}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Direccion:</span> {recipient.address}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Teléfono:</span> {recipient.phone}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Empresa:</span> {recipient.countryId}
                </div>
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>
  )
}

export default RecipientCard
