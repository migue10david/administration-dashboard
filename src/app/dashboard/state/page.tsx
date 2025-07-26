import { getCountries } from "@/app/lib/actions/countryActions";
import { getStates } from "@/app/lib/actions/stateActions";
import States from "@/components/state/States";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";
type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const StatePage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "10"
  );
  const { data: states, totalPages: pages } = await getStates(
    currentPage,
    postsPerPage
  );
  const { data: countries } = await getCountries(currentPage, postsPerPage);
  return (
    <div className="space-y-4 min-h-screen relative">
      <States states={states} countries={countries} />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={pages}
        />
      </div>
    </div>
  );
};

export default StatePage;
