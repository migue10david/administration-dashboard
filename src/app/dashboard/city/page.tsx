import { getCities } from "@/app/lib/actions/citiesActions";
import { getStates } from "@/app/lib/actions/stateActions";
import Cities from "@/components/citys/Cities";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CityPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "10"
  );

  const { data: cities, totalPages } = await getCities(currentPage,postsPerPage);
  const { data: states } = await getStates( currentPage, postsPerPage);
  return (
    <div className="space-y-4 min-h-screen relative">
      <Cities cities={cities} states={states} />
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

export default CityPage;
