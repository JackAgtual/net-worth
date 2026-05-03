import { Asset } from "./asset";
import { userId } from "./test-fixtures";

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset", userId });
  });

  describe("growthFromAppreciation", () => {
    it("returns undefined if amountOneYearAgo is not set", () => {
      expect(asset.getGrowthFromAppreciation()).toBeUndefined();
    });

    it("returns undefined if amountOneYearAgo is not set even with contributions", () => {
      asset.contribution = { self: 10 };
      expect(asset.getGrowthFromAppreciation()).toBeUndefined();
    });

    it("defaults to zero net contributions if contribution and withdrawals are not set", () => {
      asset.amountOneYearAgo = 50;
      expect(asset.getGrowthFromAppreciation()).toEqual(50);
    });

    it("accounts for contributions made", () => {
      asset.amountOneYearAgo = 50;
      asset.contribution = { self: 5, nonSelf: 5 };
      expect(asset.getGrowthFromAppreciation()).toEqual(40);
    });

    it("accounts for withdrawals", () => {
      asset.amountOneYearAgo = 50;
      asset.withdrawals = 10;
      expect(asset.getGrowthFromAppreciation()).toEqual(60);
    });

    it("accounts for both contributions and withdrawals", () => {
      asset.amountOneYearAgo = 50;
      asset.contribution = { self: 5, nonSelf: 5 };
      asset.withdrawals = 10;
      expect(asset.getGrowthFromAppreciation()).toEqual(50);
    });
  });

  describe("totalContributions", () => {
    it("return zero if contributions are undefined", () => {
      expect(asset.getTotalContributions()).toEqual(0);
    });

    it("adds self and non self contributions", () => {
      asset.contribution = {
        self: 100,
        nonSelf: 200,
      };

      expect(asset.getTotalContributions()).toEqual(300);
    });
  });
  describe("getNetContributions", () => {
    it("returns zero if contributions and withdrawals are undefined", () => {
      expect(asset.getNetContributions()).toEqual(0);
    });

    it("returns contribution amount if withdrawals are undefined", () => {
      asset.contribution = { self: 100, nonSelf: 200 };
      expect(asset.getNetContributions()).toEqual(300);
    });

    it("subtracts withdrawals from contributions", () => {
      asset.contribution = { self: 100, nonSelf: 200 };
      asset.withdrawals = 50;
      expect(asset.getNetContributions()).toEqual(250);
    });

    it("returns negative value if withdrawals exceed contributions", () => {
      asset.contribution = { self: 100, nonSelf: 200 };
      asset.withdrawals = 400;
      expect(asset.getNetContributions()).toEqual(-100);
    });

    it("returns negative value if contributions are undefined but withdrawals exist", () => {
      asset.withdrawals = 100;
      expect(asset.getNetContributions()).toEqual(-100);
    });
  });
});
