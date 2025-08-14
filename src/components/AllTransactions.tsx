import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRouter } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import numeral from "numeral";

const AllTransactions = ({
  month,
  year,
  yearsRange,
  transactions,
}: {
  month: number;
  year: number;
  yearsRange: number[];
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: "income" | "expense" | null;
  }[];
}) => {
  const router = useRouter();
  const selectedDate = new Date(year, month - 1, 1);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{format(selectedDate, "MMM yyyy")} Transactions</span>
          <div className="flex gap-1">
            {/* Month Select */}
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem
                    key={`transactions_month_${i}`}
                    value={`${i + 1}`}
                  >
                    {format(new Date(selectedDate.getFullYear(), i, 1), "MMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Select */}
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem
                    value={year.toString()}
                    key={`transactions_year_${year}`}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Go Button */}
            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: 2025,
                }}
              >
                Go
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">New Transaction</Link>
        </Button>
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
                <TableHead />
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AllTransactions;
