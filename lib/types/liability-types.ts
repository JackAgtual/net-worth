import { LiabilityInputSchema } from "@/generated/prisma/schemas";
import z from "zod";

export const liabilityFormSchema = LiabilityInputSchema.omit({
  statement: true,
});

export type LiabilityForm = z.infer<typeof liabilityFormSchema>;
