import { Decimal } from "@prisma/client/runtime/client";

export function toDecimal(input: Decimal | null): Decimal {
  return input ?? Decimal(0);
}
