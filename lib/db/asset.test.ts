import { AssetCategory, type Asset } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import {
  getGrowthFromAppreciation,
  getTotalContributions,
  getNetContributions,
} from "./asset";

describe("Asset", () => {
  let asset: Asset;

  beforeEach(() => {
    asset = {
      id: 1,
      statementId: 1,
      amount: Decimal(100),
      title: "my asset",
      category: AssetCategory.CASH,
      amountOneYearAgo: null,
      includeInGrowthCalculation: false,
      nonSelfContributions: Decimal(0),
      selfContributions: Decimal(0),
      notes: null,
      retirement: false,
      withdrawals: null,
    };
  });

  describe("growthFromAppreciation", () => {
    it("returns undefined if amountOneYearAgo is not set", () => {
      expect(getGrowthFromAppreciation(asset)).toBeUndefined();
    });

    it("returns undefined if amountOneYearAgo is not set even with contributions", () => {
      asset.selfContributions = Decimal(10);
      expect(getGrowthFromAppreciation(asset)).toBeUndefined();
    });

    it("defaults to zero net contributions if contribution and withdrawals are not set", () => {
      asset.amountOneYearAgo = Decimal(50);
      expect(getGrowthFromAppreciation(asset)).toEqual(Decimal(50));
    });

    it("accounts for contributions made", () => {
      asset.amountOneYearAgo = Decimal(50);
      asset.selfContributions = Decimal(5);
      asset.nonSelfContributions = Decimal(5);
      expect(getGrowthFromAppreciation(asset)).toEqual(Decimal(40));
    });

    it("accounts for withdrawals", () => {
      asset.amountOneYearAgo = Decimal(50);
      asset.withdrawals = Decimal(10);
      expect(getGrowthFromAppreciation(asset)).toEqual(Decimal(60));
    });

    it("accounts for both contributions and withdrawals", () => {
      asset.amountOneYearAgo = Decimal(50);
      asset.selfContributions = Decimal(5);
      asset.nonSelfContributions = Decimal(5);
      asset.withdrawals = Decimal(10);
      expect(getGrowthFromAppreciation(asset)).toEqual(Decimal(50));
    });
  });

  describe("totalContributions", () => {
    it("return zero if contributions are undefined", () => {
      expect(getTotalContributions(asset)).toEqual(Decimal(0));
    });

    it("adds self and non self contributions", () => {
      asset.selfContributions = Decimal(100);
      asset.nonSelfContributions = Decimal(200);
      expect(getTotalContributions(asset)).toEqual(Decimal(300));
    });
  });

  describe("getNetContributions", () => {
    it("returns zero if contributions and withdrawals are undefined", () => {
      expect(getNetContributions(asset)).toEqual(Decimal(0));
    });

    it("returns contribution amount if withdrawals are undefined", () => {
      asset.selfContributions = Decimal(100);
      asset.nonSelfContributions = Decimal(200);

      expect(getNetContributions(asset)).toEqual(Decimal(300));
    });

    it("subtracts withdrawals from contributions", () => {
      asset.selfContributions = Decimal(100);
      asset.nonSelfContributions = Decimal(200);
      asset.withdrawals = Decimal(50);
      expect(getNetContributions(asset)).toEqual(Decimal(250));
    });

    it("returns negative value if withdrawals exceed contributions", () => {
      asset.selfContributions = Decimal(100);
      asset.nonSelfContributions = Decimal(200);
      asset.withdrawals = Decimal(400);
      expect(getNetContributions(asset)).toEqual(Decimal(-100));
    });

    it("returns negative value if contributions are undefined but withdrawals exist", () => {
      asset.withdrawals = Decimal(100);
      expect(getNetContributions(asset)).toEqual(Decimal(-100));
    });
  });
});
