import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addDays } from "date-fns";
import { categoriesTable } from "@/db/schema";
import { format } from "date-fns/format";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema object for the transaction form
export const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.number().positive("Please select a category"),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must contain a maximum of 300 characters"),
});

/**
 * Produces the transaction form
 * @param categories List of categories from the categories table
 * @returns Transaction Form component
 */
const TransactionForm = ({
  categories,
  onSubmit,
  defaultValues,
}: {
  categories: (typeof categoriesTable.$inferSelect)[];
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    transactionType: "income" | "expense";
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  };
}) => {
  // Use Form from react-hook-form and set resolver and default schema
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionType: "income",
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      ...defaultValues,
    },
  });

  // Watch the transaction Type field and update the categories when it is changed
  const transactionType = form.watch("transactionType");
  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType
  );

  // Return the component
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Fields where the width should only be half the size of the form */}
        <fieldset
          className="grid grid-cols-2 gap-y-5 gap-x-2 items-start"
          disabled={form.formState.isSubmitting}
        >
          {/* Transaction Type */}
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Transaction Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Category ID */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Transaction Date */}
          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Transaction Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{
                            after: new Date(),
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step={0.01}
                      className="w-full"
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>

        {/* Fields that should be the full size of the form */}
        <fieldset
          className="mt-5 flex flex-col gap-5"
          disabled={form.formState.isSubmitting}
        >
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Submit button */}
          <Button type="submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default TransactionForm;
