import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

const AllTransactions = ({
  month,
  year,
  yearsRange,
}: {
  month: number;
  year: number;
  yearsRange: number[];
}) => {
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
      </CardContent>
    </Card>
  );
};

export default AllTransactions;
