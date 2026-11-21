import {
  type Asset,
  type Liability,
  AssetCategory,
} from "@/generated/prisma/client";
import { Contributor, FullStatement } from "@/types/types";
import { Numberify } from "./numberify";
import {
  getContributionAmountByContributor,
  getContributioPercentOfSalaryByContributor,
  getLastYearAssetGrowth,
  getLastYearAssetGrowthPercentOfSalary,
  getNetContributions,
  getNetContributionsPercentOfSalary,
  getNetWorth,
  getPercentOfSalary,
  getRetirementAssetsByCategory,
  getTotalAssetAmount,
  getTotalAssetAmountByCategory,
  getTotalLiabilityAmount,
  getTotalRetirementAssets,
  getTotalWithdrawals,
  getTotalWithdrawalsPercentOfSalary,
} from "./statement";

describe("Statement", () => {
  let statement: Numberify<FullStatement>;
  const statementId = 1;

  beforeEach(() => {
    const assets: Numberify<Asset>[] = [
      {
        id: 1,
        statementId,
        title: "Savings",
        amount: 2_000,
        category: AssetCategory.CASH,
        amountOneYearAgo: null,
        includeInGrowthCalculation: false,
        nonSelfContributions: null,
        selfContributions: null,
        notes: null,
        retirement: false,
        withdrawals: null,
      },
      {
        id: 2,
        statementId,
        title: "Emergency fund",
        amount: 10_000,
        category: AssetCategory.CASH,
        amountOneYearAgo: 9_000,
        selfContributions: 250,
        nonSelfContributions: 250,
        includeInGrowthCalculation: false,
        notes: null,
        retirement: false,
        withdrawals: null,
      },
      {
        id: 3,
        statementId,
        title: "Tabxable individual",
        amount: 10_000,
        category: AssetCategory.AFTER_TAX,
        amountOneYearAgo: 5_000,
        includeInGrowthCalculation: true,
        selfContributions: 4_500,
        nonSelfContributions: 0,
        notes: null,
        retirement: false,
        withdrawals: null,
      },
      {
        id: 4,
        statementId,
        title: "Crypto",
        amount: 10_000,
        category: AssetCategory.AFTER_TAX,
        amountOneYearAgo: null,
        includeInGrowthCalculation: false,
        nonSelfContributions: null,
        notes: null,
        retirement: false,
        selfContributions: null,
        withdrawals: null,
      },
      {
        id: 5,
        statementId,
        title: "401k company match",
        amount: 10_000,
        category: AssetCategory.TAX_DEFERRED,
        amountOneYearAgo: 7000,
        includeInGrowthCalculation: true,
        selfContributions: 0,
        nonSelfContributions: 1000,
        retirement: true,
        notes: null,
        withdrawals: null,
      },
      {
        id: 6,
        statementId,
        title: "Roth IRA",
        amount: 30_000,
        category: AssetCategory.TAX_FREE,
        includeInGrowthCalculation: true,
        amountOneYearAgo: 22_000,
        selfContributions: 6_500,
        nonSelfContributions: 0,
        retirement: true,
        notes: null,
        withdrawals: null,
      },
      {
        id: 7,
        statementId,
        title: "Roth 401k",
        amount: 80_000,
        category: AssetCategory.TAX_FREE,
        amountOneYearAgo: 50_000,
        includeInGrowthCalculation: true,
        selfContributions: 25_000,
        nonSelfContributions: 0,
        retirement: true,
        notes: null,
        withdrawals: null,
      },
    ];

    const liabilities: Numberify<Liability>[] = [
      {
        id: 1,
        statementId,
        title: "Liability 1",
        amount: 500,
        amountOneYearAgo: null,
        notes: null,
        paymentsMade: null,
      },
      {
        id: 2,
        statementId,
        title: "Liability 2",
        amount: 1234,
        amountOneYearAgo: null,
        notes: null,
        paymentsMade: null,
      },
    ];

    statement = {
      id: 1,
      userId: "abc-123",
      year: 2026,
      lastYearSalary: 100_000,
      assets,
      liabilities,
    };
  });

  it("getTotalAssetAmount sums all assets", () => {
    expect(getTotalAssetAmount(statement)).toEqual(152_000);
  });

  it("getTotalLiabilityAmount sums all liabilities", () => {
    expect(getTotalLiabilityAmount(statement)).toEqual(1734);
  });

  it("getNetWorth calculates net worth", () => {
    expect(getNetWorth(statement)).toEqual(150_266);
  });

  describe("getTotalAssetAmountByCategory", () => {
    it("calculates CASH category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.CASH)
      ).toEqual(12_000);
    });

    it("calculates after tax category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.AFTER_TAX)
      ).toEqual(20_000);
    });

    it("calculates tax deferred category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.TAX_DEFERRED)
      ).toEqual(10_000);
    });

    it("calculates tax free category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.TAX_FREE)
      ).toEqual(110_000);
    });

    it("calculates property category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.PROPERTY)
      ).toEqual(0);
    });
  });

  describe("getContributionAmountByContributor", () => {
    it("getContributionAmountByContributor calculates contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.Self)
      ).toEqual(36_250);
    });

    it("calculates non self contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.NonSelf)
      ).toEqual(1_250);
    });

    it("calculates all contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.All)
      ).toEqual(37_500);
    });
  });

  describe("getContributioPercentOfSalaryByContributor", () => {
    it("returns undefined if lastYearSalary is undefined", () => {
      statement.lastYearSalary = null;
      expect(
        getContributioPercentOfSalaryByContributor(statement, Contributor.All)
      ).toBeUndefined();
    });

    it("calculates contribution percent of salary for self contributions", () => {
      expect(
        getContributioPercentOfSalaryByContributor(statement, Contributor.Self)
      ).toEqual(0.3625);
    });

    it("calculates contribution percent of salary for non self contributions", () => {
      expect(
        getContributioPercentOfSalaryByContributor(
          statement,
          Contributor.NonSelf
        )
      ).toEqual(0.0125);
    });

    it("calculates contribution percent of salary for all contributions", () => {
      expect(
        getContributioPercentOfSalaryByContributor(statement, Contributor.All)
      ).toEqual(0.375);
    });
  });

  describe("getLastYearAssetGrowth", () => {
    it("calculates last year asset growth", () => {
      expect(getLastYearAssetGrowth(statement)).toEqual(9_000);
    });

    describe("specific cases", () => {
      let asset: Numberify<Asset>;

      function buildStatement() {
        statement.assets = [asset];
      }

      beforeEach(() => {
        asset = {
          id: 1,
          statementId,
          title: "Savings",
          amount: 2_000,
          category: AssetCategory.CASH,
          includeInGrowthCalculation: true,
          amountOneYearAgo: 1_000,
          selfContributions: 100,
          nonSelfContributions: 0,
          notes: null,
          retirement: false,
          withdrawals: null,
        };
      });

      it("returns 0 if amountOneYearAgo is null", () => {
        asset.amountOneYearAgo = null;
        buildStatement();
        const ans = getLastYearAssetGrowth(statement);
        expect(getLastYearAssetGrowth(statement)).toEqual(0);
      });

      it("calculates without contribution", () => {
        asset.selfContributions = null;
        asset.nonSelfContributions = null;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(1_000);
      });

      it("checks for include in growth", () => {
        asset.includeInGrowthCalculation = false;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(0);

        asset.includeInGrowthCalculation = true;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(900);
      });

      it("accounts for negative contribution and decrease in amount", () => {
        asset.selfContributions = -100;
        asset.nonSelfContributions = 0;
        asset.amountOneYearAgo = 3_000;

        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(-900);
      });

      it("accounts for negative contribution and increase in amount", () => {
        asset.selfContributions = -100;
        asset.nonSelfContributions = 0;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(1_100);
      });

      it("accounts for positive contribution and increase in amount", () => {
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(900);
      });

      it("accounts for positive contribution and decrease in amount", () => {
        asset.amount = 800;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(-300);
      });
    });
  });

  describe("getLastYearAssetGrowthPercentOfSalary", () => {
    it("returns undefined if last year salary is null", () => {
      statement.lastYearSalary = null;

      expect(getLastYearAssetGrowthPercentOfSalary(statement)).toBeUndefined();
    });

    it("calculates correct value", () => {
      expect(getLastYearAssetGrowthPercentOfSalary(statement)).toEqual(0.09);
    });
  });

  describe("getTotalRetirementAssets", () => {
    it("calcultes correct value", () => {
      expect(getTotalRetirementAssets(statement)).toEqual(120_000);
    });
  });

  describe("getRetirementAssetsByCategory", () => {
    it("returns 0 for category that does not exist as reitrement asset", () => {
      expect(
        getRetirementAssetsByCategory(statement, AssetCategory.PROPERTY)
      ).toEqual(0);
    });

    it("calculates total amount for category that exists as retirement asset(s)", () => {
      expect(
        getRetirementAssetsByCategory(statement, AssetCategory.TAX_FREE)
      ).toEqual(110_000);
    });
  });

  describe("getTotalWithdrawals", () => {
    it("returns 0 if no assets have withdrawals", () => {
      expect(getTotalWithdrawals(statement)).toEqual(0);
    });

    it("sums withdrawals across all assets", () => {
      statement.assets[0].withdrawals = 500;
      statement.assets[1].withdrawals = 1000;

      expect(getTotalWithdrawals(statement)).toEqual(1500);
    });

    it("treats undefined withdrawals as zero", () => {
      statement.assets[0].withdrawals = 300;

      expect(getTotalWithdrawals(statement)).toEqual(300);
    });
  });

  describe("getNetContributions", () => {
    it("returns total contributions when there are no withdrawals", () => {
      expect(getNetContributions(statement)).toEqual(37_500);
    });

    it("subtracts withdrawals from total contributions", () => {
      statement.assets[0].withdrawals = 500;

      expect(getNetContributions(statement)).toEqual(37_000);
    });

    it("returns negative value if withdrawals exceed contributions", () => {
      statement.assets[0].withdrawals = 40_000;

      expect(getNetContributions(statement)).toEqual(-2_500);
    });
  });

  describe("getPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getPercentOfSalary(10_000, statement)).toBeUndefined();
    });

    it("calculates percent of salary", () => {
      expect(getPercentOfSalary(25_000, statement)).toEqual(0.25);
    });
  });

  describe("getTotalWithdrawalsPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getTotalWithdrawalsPercentOfSalary(statement)).toBeUndefined();
    });

    it("returns 0 if there are no withdrawals", () => {
      expect(getTotalWithdrawalsPercentOfSalary(statement)).toEqual(0);
    });

    it("calculates withdrawals as percent of salary", () => {
      statement.assets[0].withdrawals = 10_000;

      expect(getTotalWithdrawalsPercentOfSalary(statement)).toEqual(0.1);
    });
  });

  describe("getNetContributionsPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getNetContributionsPercentOfSalary(statement)).toBeUndefined();
    });

    it("calculates net contributions as percent of salary with no withdrawals", () => {
      expect(getNetContributionsPercentOfSalary(statement)).toEqual(0.375);
    });

    it("accounts for withdrawals when calculating percent of salary", () => {
      statement.assets[0].withdrawals = 7_500;

      expect(getNetContributionsPercentOfSalary(statement)).toEqual(0.3);
    });
  });
});
