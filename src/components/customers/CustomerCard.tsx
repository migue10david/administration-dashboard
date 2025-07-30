import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { City, Customer } from "@/app/lib/types/modelTypes";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = {
  customers: Customer[];
  cities: City[]
};

const CustomerCard = ({ customers,cities }: Props) => {
  return (
    <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Link key={customer.id} href={`/dashboard/customer/${customer.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="flex px-4">
              {/* Sección de la foto */}
              <div className="w-1/3 flex items-center justify-center p-4">
                {customer.imageUrl ? (
                  <Image
                    src={customer?.imageUrl || "/no-user.webp"}
                    alt={customer?.firstName + " " + customer?.lastNameOne}
                    height={200}
                    width={200}
                  />
                ) : (
                  <Image
                    src={"/no-user.webp"}
                    alt={customer?.firstName + " " + customer?.lastNameOne}
                    height={200}
                    width={200}
                  />
                )}
              </div>

              {/* Sección de información */}
              <div className="w-2/3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">
                    {customer.firstName}{" "}
                    {customer.middleName && `${customer.middleName} `}
                    {customer.lastNameOne} {customer.lastNameTwo}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        customer.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Codigo {customer.code}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-1 text-sm grid grid-cols-2 gap-4">
                 <div>
                   <div className="truncate">
                    <span className="font-medium">Tel:</span> {customer.phone}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Nac:</span>{" "}
                    {format(new Date(customer.dob), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">DL:</span> {customer.dlid}
                  </div>
                 </div>
                  <div>
                    <div className="truncate">
                    <span className="font-medium">SSN:</span> {customer.ssn}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Zip Code:</span> {customer.zipCode}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Ciudad:</span> {cities.find((city) => city.id === customer.cityId.toString())?.name}
                  </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CustomerCard;
