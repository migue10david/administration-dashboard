import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Companias } from '@/app/lib/types/modelTypes'

type Props = {
    companias: Companias[]
}

const CompaniaTable = ({ companias }: Props) => {
  return (
    <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Direccion</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Comentario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companias.map((compania) => (
                <TableRow key={compania.id}>
                  <TableCell className="font-medium">{compania.nombre}</TableCell>
                  <TableCell>{compania.direccion}</TableCell> 
                  <TableCell>{compania.telefono}</TableCell>
                  <TableCell>{compania.comentarios}</TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  )
}

export default CompaniaTable
