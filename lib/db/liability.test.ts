import type { Liability } from "@/generated/prisma/client";
import { getGrowthFromInterest } from "./liability";
import { Numberify } from "./numberify";

describe("Liability getGrowthFromInterest(liability)", () => {
  let liability: Numberify<Liability>;

  beforeEach(() => {
    liability = {
      id: 1,
      statementId: 1,
      title: "Car loan",
      amount: 15000,
      amountOneYearAgo: null,
      notes: null,
      paymentsMade: null,
    };
  });

  it("returns correct growth when both optional fields are present", () => {
    liability.amountOneYearAgo = 14000;
    liability.paymentsMade = 2000;
    expect(getGrowthFromInterest(liability)).toEqual(3000);

    liability.amountOneYearAgo = 16000;
    liability.paymentsMade = 1100;
    expect(getGrowthFromInterest(liability)).toEqual(100);
  });

  it("returns undefined when amountOneYearAgo is missing", () => {
    liability.paymentsMade = 1000;
    expect(getGrowthFromInterest(liability)).toBeNull();
  });

  it("calculates growth from interest when paymentsMade is missing", () => {
    liability.amountOneYearAgo = 14000;
    expect(getGrowthFromInterest(liability)).toEqual(1000);
  });

  it("returns undefined when both optional fields are missing", () => {
    expect(getGrowthFromInterest(liability)).toBeNull();
  });

  it("treats paymentsMade=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = 14000;
    liability.paymentsMade = 0;
    expect(getGrowthFromInterest(liability)).toEqual(1000);
  });

  it("treats amountOneYearAgo=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = 0;
    liability.paymentsMade = 1000;
    expect(getGrowthFromInterest(liability)).toEqual(16000);
  });
});
