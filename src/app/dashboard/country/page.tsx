import { getCountries } from "@/app/lib/actions/countryActions";
import Countrys from "@/components/country/Countrys";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import React from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const CountryPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "10"
  );
  const { data: countrys, totalPages } = await getCountries(
    currentPage,
    postsPerPage
  );
  return (
    <div className="space-y-4 min-h-screen relative">
      <Countrys country={countrys} />
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

export default CountryPage;
