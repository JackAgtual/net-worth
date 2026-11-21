import { AssetInputSchema } from "@/generated/prisma/schemas";
import z from "zod";

export const assetFormSchema = AssetInputSchema.omit({ statement: true });

export type AssetForm = z.infer<typeof assetFormSchema>;
