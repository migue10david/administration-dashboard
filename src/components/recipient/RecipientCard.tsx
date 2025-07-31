import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { City, Recipient } from '@/app/lib/types/modelTypes'
import Link from 'next/link'
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from 'next/image';

type Props = {
    recipients: Recipient[]
    cities: City[]
}

const RecipientCard = ({ recipients,cities }: Props) => {
  return (
     <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recipients.map((recipient) => (
        <Link key={recipient.id} href={`/dashboard/recipient/${recipient.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="flex px-4">
              {/* Sección de la foto */}
              <div className="w-1/3 flex items-center justify-center p-4">
                {recipient.imageUrl ? (
                  <Image
                    src={recipient?.imageUrl || "/no-user.webp"}
                    alt={recipient?.firstName + " " + recipient?.lastNameOne}
                    height={200}
                    width={200}
                  />
                ) : (
                  <Image
                    src={"/no-user.webp"}
                    alt={recipient?.firstName + " " + recipient?.lastNameOne}
                    height={200}
                    width={200}
                  />
                )}
              </div>

              {/* Sección de información */}
              <div className="w-2/3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">
                    {recipient.firstName}{" "}
                    {recipient.middleName && `${recipient.middleName} `}
                    {recipient.lastNameOne} {recipient.lastNameTwo}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        recipient.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recipient.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Codigo {recipient.code}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-1 text-sm grid grid-cols-2 gap-4">
                 <div>
                   <div className="truncate">
                    <span className="font-medium">Tel:</span> {recipient.phone}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Nac:</span>{" "}
                    {format(new Date(recipient.dob), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">DL:</span> {recipient.dlid}
                  </div>
                 </div>
                  <div>
                    <div className="truncate">
                    <span className="font-medium">SSN:</span> {recipient.ssn}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Zip Code:</span> {recipient.zipCode}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Ciudad:</span> {cities.find((city) => city.id === recipient.cityId.toString())?.name}
                  </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default RecipientCard
