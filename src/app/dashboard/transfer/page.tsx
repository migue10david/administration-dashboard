import { getCompanies } from "@/app/lib/actions/companyActions";
import { getCustomers } from "@/app/lib/actions/customersActions";
import { getRecipients } from "@/app/lib/actions/recipientActions";
import { getWireTransfer } from "@/app/lib/actions/wireTransferActions";
import WireTransfers from "@/components/transfer/WireTransfers";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";
type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const TransferPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "12"
  );
  const { data: wireTranfers, totalPages } = await getWireTransfer();
  const { data: companies } = await getCompanies();
  const { data: customers } = await getCustomers();
  const { data: recipients } = await getRecipients();

  return (
    <div className="px-4 py-4">
      <WireTransfers wireTranfers={wireTranfers} companies={companies} customers={customers} recipients={recipients} />
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

export default TransferPage;
