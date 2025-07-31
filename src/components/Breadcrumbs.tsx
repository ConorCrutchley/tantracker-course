import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { FileRoutesByTo } from "@/routeTree.gen";
import { Link } from "@tanstack/react-router";
import React from "react";

const Breadcrumbs = ({
  breadcrumbList,
}: {
  breadcrumbList: { to: keyof FileRoutesByTo; title: string }[];
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbList.map((breadcrumb, i) => {
          const key = `breadcrumb_${i}_${breadcrumb.to}`;
          return i === breadcrumbList.length - 1 ? (
            <BreadcrumbItem key={key}>
              <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <React.Fragment key={key}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.to}>{breadcrumb.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
