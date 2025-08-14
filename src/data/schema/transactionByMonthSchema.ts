import z from "zod";

const today = new Date();
export const transactionByMonthSchema = z.object({
  month: z.number().min(1).max(12),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear()),
});
