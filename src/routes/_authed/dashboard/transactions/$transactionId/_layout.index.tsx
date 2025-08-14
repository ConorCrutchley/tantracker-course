import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/TransactionForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { format } from "date-fns";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import { toast } from "sonner";
import { updateTransaction } from "@/data/updateTransaction";
import z from "zod";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    return (
      <div className="text-3xl text-muted-foreground">
        Oops! Transaction not found.
      </div>
    );
  },
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({ data: { transactionId: Number(params.transactionId) } }),
    ]);

    if (!transaction) throw new Error("Transaction not found");
    return {
      categories,
      transaction,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categories, transaction } = Route.useLoaderData();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      },
    });
    toast("Success!", {
      className: "bg-green-500 text-white p-4 rounded-xs w-100",
      unstyled: true,
      description: "Transaction updated",
    });
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };
  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find((category) => category.id === transaction.id)
                ?.type ?? "income",
          }}
        />
      </CardContent>
    </Card>
  );
}
