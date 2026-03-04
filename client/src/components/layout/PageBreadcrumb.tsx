import * as React from "react";
import { Link } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; href?: string };

interface PageBreadcrumbProps {
  items: Crumb[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-6 md:mb-8">
      <BreadcrumbList className="text-xs md:text-sm font-medium tracking-wide text-muted-foreground">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-foreground font-semibold">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
