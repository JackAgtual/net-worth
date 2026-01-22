import { z } from "zod";

export const userItemSchema = z.object({ userId: z.string() });

export type UserItem = z.infer<typeof userItemSchema>;

export const entrySchema = userItemSchema.extend({
  title: z.string().trim(),
  amount: z.number(),
  notes: z.string().optional(),
});

export type Entry = z.infer<typeof entrySchema>;

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

export enum Contributor {
  Self = "Self",
  NonSelf = "Non self",
  All = "All",
}
