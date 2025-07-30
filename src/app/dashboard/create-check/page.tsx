import { filters, getCustomers } from "@/app/lib/actions/customersActions";
import { getSettings } from "@/app/lib/actions/settingsActions";
import { getTransactionTypes } from "@/app/lib/actions/transactionTypeActions";
import Search from "@/components/common/search";
import CreateCheckForm from "@/components/home/CreateCheckForm";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CreateCheckPage = async ({searchParams}: Props) => {
  const resolvedSearchParams = await searchParams;
    const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
    const postsPerPage = parseInt(
      (resolvedSearchParams.pageSize as string) || "12"
    );
    const filters: filters ={
      search: resolvedSearchParams.search as string || ""
    } 
    const { data, totalPages } = await getCustomers(filters);
  const transactionTypes = await getTransactionTypes();
  const { data: settings } = await getSettings();
  return (
    <div>
       <Label htmlFor="recipient" className="text-gray-600">
            Destinatario *
          </Label>
          <div className="flex items-center gap-2">
            <Search />
          </div>
      <CreateCheckForm
        customer={data[0]}
        settings={settings}
        transactionTypes={transactionTypes}
      />
    </div>
  );
};

export default CreateCheckPage;
