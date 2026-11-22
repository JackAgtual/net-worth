import { Decimal } from "@prisma/client/runtime/client";
import { expectTypeOf } from "vitest";
import { numberify } from "./numberify";

const dec = (n: number | string) => new Decimal(n);

describe("numberify", () => {
  describe("primitives", () => {
    it("converts a Decimal to a number", () => {
      expect(numberify(dec("550.25"))).toBe(550.25);
    });

    it("handles zero and negative values", () => {
      expect(numberify(dec(0))).toBe(0);
      expect(numberify(dec("-12.5"))).toBe(-12.5);
    });

    it("leaves null and undefined unchanged", () => {
      expect(numberify(null)).toBeNull();
      expect(numberify(undefined)).toBeUndefined();
    });

    it("leaves strings, numbers, and booleans unchanged", () => {
      expect(numberify("text")).toBe("text");
      expect(numberify(42)).toBe(42);
      expect(numberify(true)).toBe(true);
    });

    it("leaves Dates unchanged", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = numberify(date);

      expect(result).toBeInstanceOf(Date);
      expect(result).toEqual(date);
    });
  });

  describe("objects", () => {
    it("converts Decimal properties and leaves others alone", () => {
      const result = numberify({
        id: 1,
        title: "Savings",
        retirement: false,
        amount: dec("200.5"),
        notes: null,
      });

      expect(result).toStrictEqual({
        id: 1,
        title: "Savings",
        retirement: false,
        amount: 200.5,
        notes: null,
      });
    });

    it("keeps nullable Decimal fields null and converts them when set", () => {
      const result = numberify({
        amountOneYearAgo: null as Decimal | null,
        withdrawals: dec(10) as Decimal | null,
      });

      expect(result.amountOneYearAgo).toBeNull();
      expect(result.withdrawals).toBe(10);
    });

    it("preserves Date properties", () => {
      const createdAt = new Date("2024-06-01T00:00:00Z");
      const result = numberify({ createdAt, amount: dec(5) });

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt).toEqual(createdAt);
      expect(result.amount).toBe(5);
    });

    it("converts deeply nested Decimals", () => {
      const result = numberify({ a: { b: { c: dec("1.5") } } });

      expect(result).toStrictEqual({ a: { b: { c: 1.5 } } });
    });

    it("handles an empty object", () => {
      expect(numberify({})).toStrictEqual({});
    });
  });

  describe("arrays", () => {
    it("converts an array of Decimals", () => {
      expect(numberify([dec(1), dec("2.5")])).toStrictEqual([1, 2.5]);
    });

    it("converts Decimals inside arrays of objects", () => {
      const result = numberify([
        { title: "a1", amount: dec(200) },
        { title: "a2", amount: dec(1000) },
      ]);

      expect(result).toStrictEqual([
        { title: "a1", amount: 200 },
        { title: "a2", amount: 1000 },
      ]);
    });

    it("handles an empty array", () => {
      expect(numberify([])).toStrictEqual([]);
    });
  });

  describe("statement-shaped data", () => {
    it("converts Decimals through nested relations", () => {
      const statement = {
        id: 1,
        userId: "u1",
        year: 2024,
        lastYearSalary: dec("100000"),
        assets: [
          {
            id: 1,
            title: "401k",
            category: "TAX_DEFERRED",
            amount: dec("5000.75"),
            amountOneYearAgo: null,
            selfContributions: dec("500"),
          },
        ],
        liabilities: [
          { id: 1, title: "Loan", amount: dec("250.10"), paymentsMade: null },
        ],
      };

      expect(numberify(statement)).toStrictEqual({
        id: 1,
        userId: "u1",
        year: 2024,
        lastYearSalary: 100000,
        assets: [
          {
            id: 1,
            title: "401k",
            category: "TAX_DEFERRED",
            amount: 5000.75,
            amountOneYearAgo: null,
            selfContributions: 500,
          },
        ],
        liabilities: [
          { id: 1, title: "Loan", amount: 250.1, paymentsMade: null },
        ],
      });
    });
  });

  describe("immutability", () => {
    it("does not mutate the input", () => {
      const input = { amount: dec(10), items: [{ amount: dec(20) }] };

      numberify(input);

      expect(input.amount).toBeInstanceOf(Decimal);
      expect(input.items[0].amount).toBeInstanceOf(Decimal);
    });

    it("returns a new object", () => {
      const input = { title: "x" };

      expect(numberify(input)).not.toBe(input);
    });
  });

  describe("types", () => {
    it("maps Decimal to number", () => {
      expectTypeOf(numberify(dec(1))).toEqualTypeOf<number>();
    });

    it("maps Decimal | null to number | null", () => {
      const value = dec(1) as Decimal | null;

      expectTypeOf(numberify(value)).toEqualTypeOf<number | null>();
    });

    it("maps Decimal properties in objects and arrays", () => {
      const input = {
        id: 1,
        amount: dec(1),
        createdAt: new Date(),
        items: [{ amount: dec(2) as Decimal | null }],
      };

      expectTypeOf(numberify(input)).toEqualTypeOf<{
        id: number;
        amount: number;
        createdAt: Date;
        items: { amount: number | null }[];
      }>();
    });
  });
});
