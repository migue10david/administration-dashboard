import { getCompanias } from "@/app/lib/actions/companiasActions";
import Companies from "@/components/compania/Companies";
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
    <div className="space-y-4">
      <Companies companias={companias} />
      <PaginationWithLinks page={currentPage} pageSize={postsPerPage} totalCount={total} />
    </div>
  );
};

export default CompaniasPage;
