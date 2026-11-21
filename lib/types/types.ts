import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

export const userItemSchema = z.object({ userId: z.string() });

export type UserItem = z.infer<typeof userItemSchema>;

export const entrySchema = userItemSchema.extend({
  title: z.string().trim().nonempty(),
  amount: z.number(),
  notes: z.string().nullable().optional(),
});

export type Entry = z.infer<typeof entrySchema>;

export enum Contributor {
  Self = "Self",
  NonSelf = "Non self",
  All = "All",
}

export type FullStatement = Prisma.StatementGetPayload<{
  include: { assets: true; liabilities: true };
}>;
