import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TransactionForm from "@/components/TransactionForm";
import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";

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
  const { categories, transaction } = Route.useLoaderData();
  const handleSubmit = async () => {};
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
