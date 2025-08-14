import authMiddleware from "authMiddleware";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { transactionSchemaZod } from "@/data/schema/transactionSchema";
import { transactionsTable } from "@/db/schema";
import z from "zod";

export const createTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchemaZod>) =>
    transactionSchemaZod.parse(data)
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();
    return transaction;
  });
