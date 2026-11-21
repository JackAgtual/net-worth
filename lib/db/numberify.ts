import { Prisma } from "@/generated/prisma/client";

export type Numberify<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? T
    : T extends (infer U)[]
      ? Numberify<U>[]
      : T extends object
        ? { [K in keyof T]: Numberify<T[K]> }
        : T;

export function numberify<T>(value: T): Numberify<T> {
  if (value instanceof Prisma.Decimal) return value.toNumber() as Numberify<T>;
  if (Array.isArray(value)) return value.map(numberify) as Numberify<T>;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, numberify(v)])
    ) as Numberify<T>;
  }
  return value as Numberify<T>;
}
