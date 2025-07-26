import React from "react";
import { User } from "lucide-react";
import Image from "next/image";
import BreadCrumbs from "@/components/common/bread-crumbs";
import { getCustomersById } from "@/app/lib/actions/customersActions";
import { CustomerTab } from "@/components/customers/CustomersTab";
import { Button } from "@/components/ui/button";
import { getTransactionTypes } from "@/app/lib/actions/transactionTypeActions";
import { getCompanies } from "@/app/lib/actions/companyActions";
import { getRecipients } from "@/app/lib/actions/recipientActions";
import { getCountries } from "@/app/lib/actions/countryActions";
import { getStates } from "@/app/lib/actions/stateActions";
import { getCities } from "@/app/lib/actions/citiesActions";
type Props = {
  params: {
    id: string;
  };
  searchParams: Promise<{ [key: string]: string | undefined }>;
};


const CustomersDetailsPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const customer = await getCustomersById(id);

  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "12"
  );
  const transactionTypes = await getTransactionTypes();
  const {data} = await getCompanies();
  const {data: recipients} = await getRecipients();
  const { data: countries } = await getCountries(
    currentPage,
    postsPerPage
  );
  const { data: states} = await getStates(
    currentPage,
    postsPerPage
  );
  const { data: cities } = await getCities();


  return (
    <div className="bg-[#F3F5F9] min-h-screen">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <BreadCrumbs pages={[{name: "Clientes", url: "/dashboard/customer"}]} />
        <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 rounded-md shadow-md">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 bg-[#FAF8F9] rounded-md relative">
              <User className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-md" />
            </div>
            <h1 className="text-2xl font-bold">Detalles Personales</h1>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Editar Perfil</Button>
          </div>
          <div className="py-2 space-y-2">
            <h1 className="text-xl font-bold">Informacion Personal</h1>
            <div className="bg-[#FDFCFF] grid grid-cols-4 grid-rows-2 gap-4 px-4 py-2 rounded-md shadow-md">
              <div className="col-span-1 row-span-3 relative">
                <Image
                  src={customer?.imageUrl || "/no-user.webp"}
                  alt={customer?.firstName + " " + customer?.lastNameOne}
                  fill
                />
              </div>
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Nombre</p>
                  <h1 className="text-xl">
                    {customer?.firstName + " " + customer?.lastNameOne}
                  </h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg"> Telefono</p>
                  <h1 className="text-xl">{customer?.phone}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg"> Licencia de Conducir</p>
                  <h1 className="text-xl">{customer?.dlid}</h1>
                </div>
              </div>
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Segundo Nombre</p>
                  <h1 className="text-xl">{customer?.middleName}</h1>
                </div>
                <div>
                  <p className="text-gray-600 text-lg">Dia de nacimiento</p>
                  <h1 className="text-xl">{customer?.dob}</h1>
                </div>
                <div>
                  <p className="text-gray-600 text-lg">Seguridad Social</p>
                  <h1 className="text-xl">{customer?.ssn}</h1>
                </div>
              </div>
              <div className="row-span-2 space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Apellido</p>
                  <h1 className="text-xl">{customer?.lastNameOne}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Pais</p>
                  <h1 className="text-xl">{ countries.find((country) => country.id === customer?.countryId)?.name}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="py-2 space-y-2">
            <h1 className="text-2xl font-bold">Informacion Direccion</h1>
            <div className="bg-[#FDFCFF] grid grid-cols-3 gap-4 px-4 py-2 rounded-md shadow-md">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Direccion</p>
                  <h1 className="text-xl">{customer?.address}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg"> Zip Code</p>
                  <h1 className="text-xl">{customer?.zipCode}</h1>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Estado</p>
                  <h1 className="text-xl">{states.find((state) => state.id === customer?.stateId)?.name}</h1>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg"> Ciudad</p>
                  <h1 className="text-xl">{ cities.find((city) => city.id === customer?.cityId)?.name}</h1>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-lg">Apartamento</p>
                  <h1 className="text-xl">{customer?.apartment || "-"}</h1>
                </div>
              </div>
            </div>
          </div>
           <CustomerTab customer={customer} transactionTypes={transactionTypes} companies={data} recipients={recipients} />
        </div>
      </div>
    </div>
  );
};

export default CustomersDetailsPage;
