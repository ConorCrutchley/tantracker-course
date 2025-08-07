import { categoriesTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  const categories = await db.select().from(categoriesTable);
  return categories;
});
