import { getCompanias } from "@/app/lib/actions/companyActions";
import Companies from "@/components/company/Companies";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CompaniasPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "12"
  );

  const { companias, total } = await getCompanias(currentPage, postsPerPage);

  return (
    <div className="space-y-4 min-h-screen relative">
      <Companies companias={companias} />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <PaginationWithLinks page={currentPage} pageSize={postsPerPage} totalCount={total} />
      </div>
    </div>
  );
};

export default CompaniasPage;
