import Cashflow from "@/components/Transactions/Cashflow";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import RecentTransactions from "@/components/Transactions/RecentTransactions";
import { createFileRoute } from "@tanstack/react-router";
import { getAnnualCashflow } from "@/data/getAnnualCashflow";
import { getRecentTransactions } from "@/data/getRecentTransactions";
import { getTransactionYearsRange } from "@/data/getTransactionYearsRange";
import z from "zod";

const today = new Date();

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute("/_authed/dashboard/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),
  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({ data: { year: deps.cfyear ?? today.getFullYear() } }),
      getTransactionYearsRange(),
    ]);

    return {
      transactions,
      cashflow,
      yearsRange,
      cfyear: deps.cfyear ?? today.getFullYear(),
    };
  },
});

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData();
  return (
    <div className="max-w-screenxl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow
        yearsRange={yearsRange}
        year={cfyear}
        annualCashflow={cashflow}
      />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
