import {
  AssetInputSchema,
  LiabilityInputSchema,
  StatementInputSchema,
} from "@/generated/prisma/schemas";
import { Control } from "react-hook-form";
import { z } from "zod";

const statementFormSchema = StatementInputSchema.omit({
  user: true,
  userId: true,
}).extend({
  assets: z.array(AssetInputSchema.omit({ statement: true })),
  liabilities: z.array(LiabilityInputSchema.omit({ statement: true })),
});

export type StatementForm = z.infer<typeof statementFormSchema>;

export type StatementFormControl = Control<StatementForm>;
