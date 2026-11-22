import { AssetCategory, type Asset } from "@/generated/prisma/client";
import {
  getGrowthFromAppreciation,
  getTotalContributions,
  getNetContributions,
} from "./asset";
import { Numberify } from "./numberify";

describe("Asset", () => {
  let asset: Numberify<Asset>;

  beforeEach(() => {
    asset = {
      id: 1,
      statementId: 1,
      amount: 100,
      title: "my asset",
      category: AssetCategory.CASH,
      amountOneYearAgo: null,
      includeInGrowthCalculation: false,
      nonSelfContributions: 0,
      selfContributions: 0,
      notes: null,
      retirement: false,
      withdrawals: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe("growthFromAppreciation", () => {
    it("returns undefined if amountOneYearAgo is not set", () => {
      expect(getGrowthFromAppreciation(asset)).toBeUndefined();
    });

    it("returns undefined if amountOneYearAgo is not set even with contributions", () => {
      asset.selfContributions = 10;
      expect(getGrowthFromAppreciation(asset)).toBeUndefined();
    });

    it("defaults to zero net contributions if contribution and withdrawals are not set", () => {
      asset.amountOneYearAgo = 50;
      expect(getGrowthFromAppreciation(asset)).toEqual(50);
    });

    it("accounts for contributions made", () => {
      asset.amountOneYearAgo = 50;
      asset.selfContributions = 5;
      asset.nonSelfContributions = 5;
      expect(getGrowthFromAppreciation(asset)).toEqual(40);
    });

    it("accounts for withdrawals", () => {
      asset.amountOneYearAgo = 50;
      asset.withdrawals = 10;
      expect(getGrowthFromAppreciation(asset)).toEqual(60);
    });

    it("accounts for both contributions and withdrawals", () => {
      asset.amountOneYearAgo = 50;
      asset.selfContributions = 5;
      asset.nonSelfContributions = 5;
      asset.withdrawals = 10;
      expect(getGrowthFromAppreciation(asset)).toEqual(50);
    });
  });

  describe("totalContributions", () => {
    it("return zero if contributions are undefined", () => {
      expect(getTotalContributions(asset)).toEqual(0);
    });

    it("adds self and non self contributions", () => {
      asset.selfContributions = 100;
      asset.nonSelfContributions = 200;
      expect(getTotalContributions(asset)).toEqual(300);
    });
  });

  describe("getNetContributions", () => {
    it("returns zero if contributions and withdrawals are undefined", () => {
      expect(getNetContributions(asset)).toEqual(0);
    });

    it("returns contribution amount if withdrawals are undefined", () => {
      asset.selfContributions = 100;
      asset.nonSelfContributions = 200;

      expect(getNetContributions(asset)).toEqual(300);
    });

    it("subtracts withdrawals from contributions", () => {
      asset.selfContributions = 100;
      asset.nonSelfContributions = 200;
      asset.withdrawals = 50;
      expect(getNetContributions(asset)).toEqual(250);
    });

    it("returns negative value if withdrawals exceed contributions", () => {
      asset.selfContributions = 100;
      asset.nonSelfContributions = 200;
      asset.withdrawals = 400;
      expect(getNetContributions(asset)).toEqual(-100);
    });

    it("returns negative value if contributions are undefined but withdrawals exist", () => {
      asset.withdrawals = 100;
      expect(getNetContributions(asset)).toEqual(-100);
    });
  });
});
