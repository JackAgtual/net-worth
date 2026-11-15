import type { Liability } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { getGrowthFromInterest } from "./liability";

describe("Liability getGrowthFromInterest(liability)", () => {
  let liability: Liability;

  beforeEach(() => {
    liability = {
      id: 1,
      statementId: 1,
      title: "Car loan",
      amount: Decimal(15000),
      amountOneYearAgo: null,
      notes: null,
      paymentsMade: null,
    };
  });

  it("returns correct growth when both optional fields are present", () => {
    liability.amountOneYearAgo = Decimal(14000);
    liability.paymentsMade = Decimal(2000);
    expect(getGrowthFromInterest(liability)).toEqual(Decimal(3000));

    liability.amountOneYearAgo = Decimal(16000);
    liability.paymentsMade = Decimal(1100);
    expect(getGrowthFromInterest(liability)).toEqual(Decimal(100));
  });

  it("returns undefined when amountOneYearAgo is missing", () => {
    liability.paymentsMade = Decimal(1000);
    expect(getGrowthFromInterest(liability)).toBeUndefined();
  });

  it("calculates growth from interest when paymentsMade is missing", () => {
    liability.amountOneYearAgo = Decimal(14000);
    expect(getGrowthFromInterest(liability)).toEqual(Decimal(1000));
  });

  it("returns undefined when both optional fields are missing", () => {
    expect(getGrowthFromInterest(liability)).toBeUndefined();
  });

  it("treats paymentsMade=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = Decimal(14000);
    liability.paymentsMade = Decimal(0);
    expect(getGrowthFromInterest(liability)).toEqual(Decimal(1000));
  });

  it("treats amountOneYearAgo=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = Decimal(0);
    liability.paymentsMade = Decimal(1000);
    expect(getGrowthFromInterest(liability)).toEqual(Decimal(16000));
  });
});
