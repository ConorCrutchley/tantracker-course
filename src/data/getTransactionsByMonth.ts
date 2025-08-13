import { and, desc, eq, gte, lte } from "drizzle-orm";
import { categoriesTable, transactionsTable } from "@/db/schema";

import authMiddleware from "authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { format } from "date-fns";
import z from "zod";

const today = new Date();
const schema = z.object({
  month: z.number().min(1).max(12),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear()),
});

export const getTransactionsByMonth = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    // Get the earliest date
    const earliestDate = new Date(data.year, data.month - 1, 1);

    // Get the latest date
    // When day is set to 0, JavaScript converts this to the last day of the month
    const latestDate = new Date(data.year, data.month, 0);

    // Get the transactions from the database
    const transactions = await db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, context.userId),
          gte(
            transactionsTable.transactionDate,
            format(earliestDate, "yyyy-MM-dd")
          ),
          lte(
            transactionsTable.transactionDate,
            format(latestDate, "yyyy-MM-dd")
          )
        )
      )
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      );
    return transactions;
  });
