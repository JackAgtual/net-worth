import { Liability } from "./liability";
import { userId } from "./test-fixtures";

describe("Liability method — getGrowthFromInterest()", () => {
  let liability: InstanceType<typeof Liability>;

  beforeEach(() => {
    liability = new Liability({
      userId,
      title: "Car loan",
      amount: 15000,
    });
  });

  it("returns correct growth when both optional fields are present", () => {
    liability.amountOneYearAgo = 14000;
    liability.paymentsMade = 2000;
    expect(liability.getGrowthFromInterest()).toBe(3000);

    liability.amountOneYearAgo = 16000;
    liability.paymentsMade = 1100;
    expect(liability.getGrowthFromInterest()).toBe(100);
  });

  it("returns undefined when amountOneYearAgo is missing", () => {
    liability.paymentsMade = 1000;
    expect(liability.getGrowthFromInterest()).toBeUndefined();
  });

  it("calculates growth from interest when paymentsMade is missing", () => {
    liability.amountOneYearAgo = 14000;
    expect(liability.getGrowthFromInterest()).toBe(1000);
  });

  it("returns undefined when both optional fields are missing", () => {
    expect(liability.getGrowthFromInterest()).toBeUndefined();
  });

  it("treats paymentsMade=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = 14000;
    liability.paymentsMade = 0;
    expect(liability.getGrowthFromInterest()).toBe(1000);
  });

  it("treats amountOneYearAgo=0 as present (not null/undefined)", () => {
    liability.amountOneYearAgo = 0;
    liability.paymentsMade = 1000;
    expect(liability.getGrowthFromInterest()).toBe(16000);
  });
});
