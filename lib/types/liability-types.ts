import { LiabilityInputSchema } from "@/generated/prisma/schemas";
import z from "zod";

export const liabilityFormSchema = LiabilityInputSchema.omit({
  statement: true,
});

export type LiabilityForm = z.infer<typeof liabilityFormSchema>;

// Needed as empty default values for liability form
export const emptyLiability = {
  title: "",
  amount: "" as unknown as number,
  amountOneYearAgo: null,
  paymentsMade: null,
  notes: null,
} as LiabilityForm;
