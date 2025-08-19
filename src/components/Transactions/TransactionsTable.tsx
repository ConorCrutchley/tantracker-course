import { Link, useRouter } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import React from "react";
import { Transaction } from "@/models/transaction.model";
import { format } from "date-fns";
import numeral from "numeral";

export const TransactionsTable = ({
  transactions,
  editable = false,
}: {
  transactions: Transaction[];
  editable?: boolean;
}) => {
  const router = useRouter();
  return (
    <>
      {!transactions.length && (
        <p className="text-center py-10 text-lg text-muted-foreground">
          There are no transactions for this month
        </p>
      )}
      {!!transactions.length && (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              {editable && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.transactionDate, "do MMM yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">
                  <Badge
                    className={
                      transaction.transactionType === "income"
                        ? "bg-lime-500"
                        : "bg-orange-500"
                    }
                  >
                    {transaction.transactionType}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  £{numeral(transaction.amount).format("0,0[.]00")}
                </TableCell>
                {editable && (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit transaction"
                      asChild
                    >
                      <Link
                        onClick={() => {
                          router.clearCache({
                            filter: (route) =>
                              route.pathname !==
                              `/dashboard/transaction/${transaction.id}`,
                          });
                        }}
                        to="/dashboard/transactions/$transactionId"
                        params={{ transactionId: transaction.id.toString() }}
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
