import { getCheckTransactions } from "@/app/lib/actions/checkTransactionActions";
import { filters, getCustomers } from "@/app/lib/actions/customersActions";
import CheckTransactions from "@/components/payments/CheckTransactions";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";
type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const PaymentPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "12"
  );
      const filters: filters ={
    search: resolvedSearchParams.search as string || ""
  } 
  const { data: checkTransactions, totalPages } = await getCheckTransactions(filters);
    const { data: customers } = await getCustomers();
  return (
    <div className="px-4 py-4">
      <CheckTransactions checkTransactions={checkTransactions} customers={customers} />
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

export default PaymentPage;
