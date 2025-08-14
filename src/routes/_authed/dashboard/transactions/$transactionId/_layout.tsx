import { Outlet, createFileRoute } from "@tanstack/react-router";

import Breadcrumbs from "@/components/Breadcrumbs";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <Breadcrumbs
        breadcrumbList={[
          { to: "/dashboard", title: "Dashboard" },
          { to: "/dashboard/transactions", title: "Transactions" },
          {
            to: "/dashboard/transactions/$transactionId",
            title: "Edit Transaction",
          },
        ]}
      />
      <Outlet />
    </div>
  );
}
