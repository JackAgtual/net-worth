import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Asset, Liability, Statement } from ".";
import { AssetTestDoc, Category } from "./asset";
import { LiabilitiesTestDoc } from "./liability";
import { Contributor } from "./statement";

describe("Statement", () => {
  let mongoServer: MongoMemoryServer;
  let statement: InstanceType<typeof Statement>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: "6.0.7" },
    });

    const uri = mongoServer.getUri();
    console.log({ uri });
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }

    const assetsInput: AssetTestDoc[] = [
      {
        title: "Savings",
        amount: 2_000,
        category: Category.Cash,
      },
      {
        title: "Emergency fund",
        amount: 10_000,
        category: Category.Cash,
        amountOneYearAgo: 9_000,
        contribution: {
          amount: 500,
          selfContribution: true,
        },
      },
      {
        title: "Tabxable individual",
        amount: 10_000,
        category: Category.AfterTax,
        amountOneYearAgo: 5_000,
        includeInGrowthCalculation: true,
        contribution: {
          amount: 4_500,
          selfContribution: true,
        },
      },
      {
        title: "Crypto",
        amount: 10_000,
        category: Category.AfterTax,
      },
      {
        title: "401k company match",
        amount: 10000,
        category: Category.TaxDeferred,
        amountOneYearAgo: 7000,
        includeInGrowthCalculation: true,
        contribution: {
          amount: 1000,
          selfContribution: false,
        },
      },
      {
        title: "Roth IRA",
        amount: 30_000,
        category: Category.TaxFree,
        includeInGrowthCalculation: true,
        amountOneYearAgo: 22_000,
        contribution: {
          amount: 6_500,
          selfContribution: true,
        },
      },
      {
        title: "Roth 401k",
        amount: 80_000,
        category: Category.TaxFree,
        amountOneYearAgo: 50_000,
        includeInGrowthCalculation: true,
        contribution: {
          amount: 25_000,
          selfContribution: true,
        },
      },
      // {
      //   title: "Car",
      //   amount: 10_000,
      //   category: Category.Property,
      // },
      // {
      //   title: "house",
      //   amount: 500_000,
      //   category: Category.Property,
      // },
    ];
    const assets = await Asset.insertMany(assetsInput);

    const liabilitiesInput: LiabilitiesTestDoc[] = [
      {
        title: "Liability 1",
        amount: 500,
      },
      {
        title: "Liability 2",
        amount: 1234,
      },
    ];
    const liabilities = await Liability.insertMany(liabilitiesInput);

    statement = await Statement.create({
      year: 2026,
      lastYearSalary: 100_000,
      assets: assets.map((asset) => asset._id),
      liabilities: liabilities.map((liability) => liability._id),
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("getTotalAssetAmount sums all assets", async () => {
    expect(await statement.getTotalAssetAmount()).toEqual(152_000);
  });

  it("getTotalLiabilityAmount sums all liabilities", async () => {
    expect(await statement.getTotalLiabilityAmount()).toEqual(1734);
  });

  it("getNetWorth calculates net worth", async () => {
    expect(await statement.getNetWorth()).toEqual(150_266);
  });

  describe("getTotalAmountByCategory", () => {
    it("calculates cash category", async () => {
      expect(await statement.getTotalAmountByCategory(Category.Cash)).toEqual(
        12_000
      );
    });

    it("calculates after tax category", async () => {
      expect(
        await statement.getTotalAmountByCategory(Category.AfterTax)
      ).toEqual(20_000);
    });

    it("calculates tax deferred category", async () => {
      expect(
        await statement.getTotalAmountByCategory(Category.TaxDeferred)
      ).toEqual(10_000);
    });

    it("calculates tax free category", async () => {
      expect(
        await statement.getTotalAmountByCategory(Category.TaxFree)
      ).toEqual(110_000);
    });

    it("calculates property category", async () => {
      expect(
        await statement.getTotalAmountByCategory(Category.Property)
      ).toEqual(0);
    });
  });

  describe("getContributionAmountByContributor", () => {
    it("getContributionAmountByContributor calculates contributions", async () => {
      expect(
        await statement.getContributionAmountByContributor(Contributor.Self)
      ).toEqual(36_500);
    });

    it("calculates non self contributions", async () => {
      expect(
        await statement.getContributionAmountByContributor(Contributor.NonSelf)
      ).toEqual(1_000);
    });

    it("calculates all contributions", async () => {
      expect(
        await statement.getContributionAmountByContributor(Contributor.All)
      ).toEqual(37_500);
    });
  });

  describe("getContributioPercentOfSalaryByContributor", () => {
    it("returns undefined if lastYearSalary is undefined", async () => {
      statement.lastYearSalary = undefined;
      expect(
        await statement.getContributioPercentOfSalaryByContributor(
          Contributor.All
        )
      ).toBeUndefined();
    });

    it("calculates contribution percent of salary for self contributions", async () => {
      expect(
        await statement.getContributioPercentOfSalaryByContributor(
          Contributor.Self
        )
      ).toBeCloseTo(0.365, 3);
    });

    it("calculates contribution percent of salary for non self contributions", async () => {
      expect(
        await statement.getContributioPercentOfSalaryByContributor(
          Contributor.NonSelf
        )
      ).toBeCloseTo(0.01, 3);
    });

    it("calculates contribution percent of salary for all contributions", async () => {
      expect(
        await statement.getContributioPercentOfSalaryByContributor(
          Contributor.All
        )
      ).toBeCloseTo(0.375, 3);
    });
  });

  describe("getLastYearAssetGrowth", () => {
    it("calculates last year asset growth", async () => {
      expect(await statement.getLastYearAssetGrowth()).toEqual(9_000);
    });

    describe("specific cases", () => {
      let asset: AssetTestDoc;

      const buildAsset = async () => {
        const assets = await Asset.insertMany([asset]);
        statement.assets = assets.map((asset) => asset._id);
      };

      beforeEach(async () => {
        asset = {
          title: "Savings",
          amount: 2_000,
          category: Category.Cash,
          includeInGrowthCalculation: true,
          amountOneYearAgo: 1_000,
          contribution: {
            amount: 100,
            selfContribution: true,
          },
        };
      });

      it("returns 0 if amountOneYearAgo is undefined", async () => {
        asset.amountOneYearAgo = undefined;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(0);
      });

      it("calculates without contribution", async () => {
        asset.contribution = undefined;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(1_000);
      });

      it("checks for include in growth", async () => {
        asset.includeInGrowthCalculation = false;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(0);

        asset.includeInGrowthCalculation = undefined;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(0);
      });

      it("accounts for negative contribution and decrease in amount", async () => {
        asset.contribution = {
          amount: -100,
          selfContribution: true,
        };
        asset.amountOneYearAgo = 3_000;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(-900);
      });

      it("accounts for negative contribution and increase in amount", async () => {
        asset.contribution = {
          amount: -100,
          selfContribution: true,
        };
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(1_100);
      });

      it("accounts for positive contribution and increase in amount", async () => {
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(900);
      });

      it("accounts for positive contribution and decrease in amount", async () => {
        asset.amount = 800;
        await buildAsset();
        expect(await statement.getLastYearAssetGrowth()).toEqual(-300);
      });
    });
  });

  describe("getLastYearAssetGrowthPercentOfSalary", () => {
    it("returns undefined if last year salary is undefined", async () => {
      statement.lastYearSalary = undefined;

      expect(
        await statement.getLastYearAssetGrowthPercentOfSalary()
      ).toBeUndefined();
    });

    it("calculates correct value", async () => {
      expect(
        await statement.getLastYearAssetGrowthPercentOfSalary()
      ).toBeCloseTo(0.09, 2);
    });
  });
});
