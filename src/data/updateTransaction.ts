import { and, eq } from "drizzle-orm";

import authMiddleware from "authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { transactionSchema } from "@/data/schema/transactionSchema";
import { transactionsTable } from "@/db/schema";
import z from "zod";

const editTransactionSchema = z.object({
  ...transactionSchema,
  id: z.number(),
});

export const updateTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof editTransactionSchema>) =>
    editTransactionSchema.parse(data)
  )
  .handler(async ({ context, data }) => {
    await db
      .update(transactionsTable)
      .set({
        userId: context.userId,
        amount: data.amount.toString(),
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
        description: data.description,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId)
        )
      );
  });
