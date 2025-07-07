import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Clientes } from '@/app/lib/types/modelTypes'
import Image from 'next/image'

type Props = {
    clientes: Clientes[]
}

const ClientCard = ({ clientes }: Props) => {
  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Direccion:</span> {cliente.direccion}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Teléfono:</span> {cliente.telefono}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Empresa:</span> {cliente.nacionalidad}
                </div>
                <Image src={cliente.imageUrl} alt="cliente" width={100} height={100} />
              </CardContent>
            </Card>
          ))}
        </div>
  )
}

export default ClientCard
