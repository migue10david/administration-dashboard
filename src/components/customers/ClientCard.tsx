import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import Image from 'next/image'
import { Customer } from '@/app/lib/types/modelTypes'
import Link from 'next/link'

type Props = {
    customers: Customer[]
}

const ClientCard = ({ customers }: Props) => {
  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
          <Link key={customer.id} href={`/dashboard/customer/${customer.id}`}>
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{customer.firstName + ' ' + customer.lastNameOne}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Direccion:</span> {customer.address}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Teléfono:</span> {customer.phone}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Empresa:</span> {customer.countryId}
                </div>
                {/* {customer.imageUrl && (
                  <Image
                    src={customer.imageUrl}
                    alt={customer.firstName + ' ' + customer.lastNameOne}
                    className="h-12 w-12"
                    width={120}
                    height={120}
                  />
                )} */}
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>
  )
}

export default ClientCard
