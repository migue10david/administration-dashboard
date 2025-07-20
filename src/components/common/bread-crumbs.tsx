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
    pages: {
      name: string;
      url: string;
    }[];
};

const BreadCrumbs = ({ pages }: Props) => {
  return (
    <Breadcrumb className="pb-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
          {
            pages.map((page)=> (
              <BreadcrumbItem key={page.name}>
                <BreadcrumbLink href={page.url}>{page.name}</BreadcrumbLink>
              </BreadcrumbItem>
            ))
          }
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
