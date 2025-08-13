import AllTransactions from "../../../../components/AllTransactions";
import { createFileRoute } from "@tanstack/react-router";
import { getTransactionYearsRange } from "@/data/getTransactionYearsRange";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import z from "zod";

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1)
    .optional(),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/_layout/"
)({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => {
    const today = new Date();
    return {
      month: search.month ?? today.getMonth() + 1,
      year: search.year ?? today.getFullYear(),
    };
  },
  loader: async ({ deps }) => {
    const yearsRange = await getTransactionYearsRange();
    const transactions = await getTransactionsByMonth({
      data: deps,
    });
    return {
      ...deps,
      yearsRange,
      transactions,
    };
  },
});

function RouteComponent() {
  const { month, year, yearsRange, transactions } = Route.useLoaderData();
  console.log("transactions", transactions);
  return (
    <AllTransactions
      month={month}
      year={year}
      yearsRange={yearsRange}
      transactions={transactions}
    />
  );
}
