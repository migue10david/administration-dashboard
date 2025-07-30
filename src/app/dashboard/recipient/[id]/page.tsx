import React from "react";
import { User } from "lucide-react";
import Image from "next/image";
import BreadCrumbs from "@/components/common/bread-crumbs";
import { getTransactionTypes } from "@/app/lib/actions/transactionTypeActions";
import { getCountries } from "@/app/lib/actions/countryActions";
import { getStates } from "@/app/lib/actions/stateActions";
import { getCities } from "@/app/lib/actions/citiesActions";
import { getRecipientById } from "@/app/lib/actions/recipientActions";
import EditRecipientModal from "@/components/recipient/EditRecipientModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = {
  params: {
    id: string;
  };
};

const RecipientDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const recipient = await getRecipientById(id);
  const transactionTypes = await getTransactionTypes();
  const { data: countries } = await getCountries();
  const { data: states } = await getStates();
  const { data: cities } = await getCities();

  return (
    <div className="bg-[#F3F5F9] min-h-screen">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <BreadCrumbs pages={[{ name: "Beneficiarios", url: "/dashboard/recipient" }]} />
        
        {/* Sección de Información Personal */}
        <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 rounded-md shadow-md mb-6">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 bg-[#FAF8F9] rounded-md relative">
                <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-md" />
              </div>
              <h1 className="text-2xl font-bold">Detalles Personales</h1>
            </div>
            <EditRecipientModal 
              recipient={recipient} 
              transactionTypes={transactionTypes} 
              countries={countries} 
              states={states} 
              cities={cities} 
            />
          </div>
          
          <div className="py-2 space-y-2">
            <h1 className="text-xl font-bold">Información Personal</h1>
            <div className="bg-[#FDFCFF] grid grid-cols-4 grid-rows-2 gap-4 px-4 py-2 rounded-md shadow-md">
              <div className="col-span-1 row-span-3 relative">
                <Image
                  src={recipient?.imageUrl || "/no-user.webp"}
                  alt={recipient?.firstName + " " + recipient?.lastNameOne}
                  height={200}
                  width={200}
                  className="rounded-md"
                />
              </div>
              
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Nombre</p>
                  <h1 className="text-xl">{recipient?.firstName}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Teléfono</p>
                  <h1 className="text-xl">{recipient?.phone}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Licencia de Conducir</p>
                  <h1 className="text-xl">{recipient?.dlid}</h1>
                </div>
              </div>
              
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Segundo Nombre</p>
                  <h1 className="text-xl">{recipient?.middleName || "-"}</h1>
                </div>
                <div>
                  <p className="text-gray-600 text-lg">Fecha de Nacimiento</p>
                  <h1 className="text-xl">
                    {recipient?.dob ? format(new Date(recipient.dob), 'PPP', { locale: es }) : "-"}
                  </h1>
                </div>
                <div>
                  <p className="text-gray-600 text-lg">Seguridad Social</p>
                  <h1 className="text-xl">{recipient?.ssn}</h1>
                </div>
              </div>
              
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Apellido</p>
                  <h1 className="text-xl">{recipient?.lastNameOne}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">País</p>
                  <h1 className="text-xl">
                    {countries.find((country) => country.id === recipient?.countryId)?.name || "-"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección de Información de Dirección */}
          <div className="py-2 space-y-2 mt-4">
            <h1 className="text-2xl font-bold">Información de Dirección</h1>
            <div className="bg-[#FDFCFF] grid grid-cols-3 gap-4 px-4 py-2 rounded-md shadow-md">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Dirección</p>
                  <h1 className="text-xl">{recipient?.address}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Código Postal</p>
                  <h1 className="text-xl">{recipient?.zipCode}</h1>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Estado</p>
                  <h1 className="text-xl">
                    {states.find((state) => state.id === recipient?.stateId)?.name || "-"}
                  </h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Ciudad</p>
                  <h1 className="text-xl">
                    {cities.find((city) => city.id === recipient?.cityId)?.name || "-"}
                  </h1>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Apartamento</p>
                  <h1 className="text-xl">{recipient?.apartment || "-"}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Transferencias Recibidas */}
        <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 rounded-md shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Historial de Transferencias</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {recipient.receivedTransfers.length} transacciones
              </span>
            </div>
          </div>

          {recipient.receivedTransfers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Neto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipient.receivedTransfers.map((transfer: any) => (
                    <TableRow key={transfer.id} className="hover:bg-gray-50">

                      <TableCell>
                        {format(new Date(transfer.createdAt), 'PP', { locale: es })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${transfer.amount.toLocaleString('es-ES')}
                      </TableCell>
                      <TableCell className="text-red-500">
                        -${transfer.feed.toLocaleString('es-ES')}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ${(transfer.amount - transfer.feed).toLocaleString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transfer.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transfer.isActive ? 'Completado' : 'Cancelado'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No se encontraron transferencias registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientDetailsPage;