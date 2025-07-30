import { getCities } from "@/app/lib/actions/citiesActions";
import { filters, getCustomers } from "@/app/lib/actions/customersActions";
import Customers from "@/components/customers/Customers";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CustomersPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "12"
  );
  const filters: filters ={
    search: resolvedSearchParams.search as string || ""
  } 
  const { data, totalPages } = await getCustomers(filters);
  const { data: cities} = await getCities();

  return (
    <div className="space-y-4">
      <Customers customers={data} cities={cities} />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPages}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
