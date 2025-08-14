import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/TransactionForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { deleteTransaction } from "@/data/deleteTransaction";
import { format } from "date-fns";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import { toast } from "sonner";
import { updateTransaction } from "@/data/updateTransaction";
import { useState } from "react";
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
  const [deleting, setDeleting] = useState(false);
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

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    });
    setDeleting(false);
    toast("Success!", {
      className: "bg-green-500 text-white p-4 rounded-xs w-100",
      unstyled: true,
      description: "Transaction deleted",
    });
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: Number(transaction.transactionDate.split("-")[1]),
        year: Number(transaction.transactionDate.split("-")[0]),
      },
    });
  };
  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be
                  permanently deleted.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    disabled={deleting}
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
