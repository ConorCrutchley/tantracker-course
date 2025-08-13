import { asc, eq } from "drizzle-orm";

import authMiddleware from "authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

export const getTransactionYearsRange = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // Get current date and set the current year
    const today = new Date();
    const currentYear = today.getFullYear();

    // Get the ealiest year a transaction appears for a user
    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, context.userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    // Get the earliest year from the returned results, default to current year
    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : currentYear;

    // Produce an array ranging from the earliest year to the current year
    const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
      (_, i) => {
        return currentYear - i;
      }
    );

    // Return the years array
    return years;
  });
