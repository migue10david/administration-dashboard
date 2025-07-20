import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import React from "react";

type Props = {
    pages: string[]
};

const BreadCrumbs = ({ pages }: Props) => {
  return (
    <Breadcrumb className="pb-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
          {pages.map((page, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={`/dashboard/${page.toLowerCase()}`}>{page}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
