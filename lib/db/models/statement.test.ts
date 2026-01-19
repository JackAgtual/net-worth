import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  Asset,
  Liability,
  Statement,
  AssetDoc,
  AssetUpdate,
  Category,
  LiabilityUpdate,
  LiabilityDoc,
  Contributor,
} from ".";

const userId = process.env.TEST_USER_ID as string;

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

    const assetsInput: AssetDoc[] = [
      {
        userId,
        title: "Savings",
        amount: 2_000,
        category: Category.Cash,
      },
      {
        userId,
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
        userId,
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
        userId,
        title: "Crypto",
        amount: 10_000,
        category: Category.AfterTax,
      },
      {
        userId,
        title: "401k company match",
        amount: 10_000,
        category: Category.TaxDeferred,
        amountOneYearAgo: 7000,
        includeInGrowthCalculation: true,
        contribution: {
          amount: 1000,
          selfContribution: false,
        },
        retirement: true,
      },
      {
        userId,
        title: "Roth IRA",
        amount: 30_000,
        category: Category.TaxFree,
        includeInGrowthCalculation: true,
        amountOneYearAgo: 22_000,
        contribution: {
          amount: 6_500,
          selfContribution: true,
        },
        retirement: true,
      },
      {
        userId,
        title: "Roth 401k",
        amount: 80_000,
        category: Category.TaxFree,
        amountOneYearAgo: 50_000,
        includeInGrowthCalculation: true,
        contribution: {
          amount: 25_000,
          selfContribution: true,
        },
        retirement: true,
      },
      // {
      //   userId,
      //   title: "Car",
      //   amount: 10_000,
      //   category: Category.Property,
      // },
      // {
      //   userId,
      //   title: "house",
      //   amount: 500_000,
      //   category: Category.Property,
      // },
    ];
    const assets = await Asset.insertMany(assetsInput);

    const liabilitiesInput: LiabilityDoc[] = [
      {
        userId,
        title: "Liability 1",
        amount: 500,
      },
      {
        userId,
        title: "Liability 2",
        amount: 1234,
      },
    ];
    const liabilities = await Liability.insertMany(liabilitiesInput);

    statement = await Statement.create({
      userId,
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

  describe("getTotalAssetAmountByCategory", () => {
    it("calculates cash category", async () => {
      expect(
        await statement.getTotalAssetAmountByCategory(Category.Cash)
      ).toEqual(12_000);
    });

    it("calculates after tax category", async () => {
      expect(
        await statement.getTotalAssetAmountByCategory(Category.AfterTax)
      ).toEqual(20_000);
    });

    it("calculates tax deferred category", async () => {
      expect(
        await statement.getTotalAssetAmountByCategory(Category.TaxDeferred)
      ).toEqual(10_000);
    });

    it("calculates tax free category", async () => {
      expect(
        await statement.getTotalAssetAmountByCategory(Category.TaxFree)
      ).toEqual(110_000);
    });

    it("calculates property category", async () => {
      expect(
        await statement.getTotalAssetAmountByCategory(Category.Property)
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
      let asset: AssetDoc;

      const buildAsset = async () => {
        const assets = await Asset.insertMany([asset]);
        statement.assets = assets.map((asset) => asset._id);
      };

      beforeEach(async () => {
        asset = {
          userId,
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

  describe("getTotalRetirementAssets", () => {
    it("calcultes correct value", async () => {
      expect(await statement.getTotalRetirementAssets()).toEqual(120_000);
    });
  });

  describe("getRetirementAssetsByCategory", () => {
    it("returns 0 for category that does not exist as reitrement asset", async () => {
      expect(
        await statement.getRetirementAssetsByCategory(Category.Property)
      ).toEqual(0);
    });

    it("calculates total amount for category that exists as retirement asset(s)", async () => {
      expect(
        await statement.getRetirementAssetsByCategory(Category.TaxFree)
      ).toEqual(110_000);
    });
  });

  describe("CRUD assets and liabilities", () => {
    beforeEach(async () => {
      const assetsInput: AssetDoc[] = [
        {
          userId,
          title: "Asset 1",
          amount: 100,
          category: Category.Cash,
        },
        {
          userId,
          title: "Asset 2",
          amount: 300,
          category: Category.TaxFree,
        },
      ];
      const assets = await Asset.insertMany(assetsInput);

      const liabilitiesInput: LiabilityDoc[] = [
        {
          userId,
          title: "Liability 1",
          amount: 500,
        },
        {
          userId,
          title: "Liability 2",
          amount: 1000,
        },
      ];
      const liabilities = await Liability.insertMany(liabilitiesInput);

      statement = await Statement.create({
        userId,
        year: 2026,
        lastYearSalary: 100_000,
        assets: assets.map((asset) => asset._id),
        liabilities: liabilities.map((liability) => liability._id),
      });
    });

    it("adds liability", async () => {
      const liability = {
        amount: 100,
        userId,
        title: "liability 3",
        notes: "my notes",
      };
      const addedLiability = await statement.addLiability(liability);
      const id = addedLiability._id;

      expect(addedLiability).toMatchObject(liability);
      expect(statement.liabilities.length).toEqual(3);
      expect(statement.liabilities.at(-1)).toEqual(id);
    });

    it("deletes liability", async () => {
      const liabilityIds = statement.liabilities;
      const idToNotDelete = liabilityIds.at(0);
      const id = liabilityIds.at(-1);
      if (id === undefined || idToNotDelete === undefined) {
        fail("id is undefined. Test needs valid ids to start.");
      }

      const deleted = await statement.deleteLiability(id);

      const newLiabilities = statement.liabilities;
      expect(newLiabilities.length).toEqual(1);
      expect(newLiabilities.includes(id)).toBeFalsy();
      expect(newLiabilities.includes(idToNotDelete)).toBeTruthy();
      expect(deleted).toBeTruthy();
    });

    it("delete liability returns false if liability id does not exist", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const deleted = await statement.deleteLiability(invalidId);

      expect(statement.liabilities.length).toEqual(2);
      expect(deleted).toBeFalsy();
    });

    it("updates liability", async () => {
      const updateIndex = 0;
      const idToUpdate = statement.liabilities.at(updateIndex);

      if (!idToUpdate) {
        fail("Need valid id for this test");
      }
      const liabilityUpdates: LiabilityUpdate = {
        amount: 600,
        notes: "an updated liability",
      };
      const updatedLiability = await statement.updateLiability(
        idToUpdate,
        liabilityUpdates
      );

      const updatedLiabilityId = statement.liabilities.at(updateIndex);

      if (!updatedLiability) {
        fail("This test requires a valid id to update");
      }
      expect(updatedLiabilityId).toEqual(updatedLiability._id);
      expect(updatedLiabilityId).toEqual(idToUpdate);
      expect(updatedLiability).toMatchObject(liabilityUpdates);
    });

    it("returns null when trying to update invalid liability id", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const updatedLiability = await statement.updateLiability(invalidId, {
        amount: 600,
        notes: "an updated liability",
      });

      expect(updatedLiability).toBeNull();
    });

    it("adds asset", async () => {
      const assetToAdd: AssetDoc = {
        userId,
        title: "a new asset",
        amount: 1000,
        category: Category.Cash,
        contribution: { amount: 100, selfContribution: true },
        retirement: false,
        amountOneYearAgo: 500,
        includeInGrowthCalculation: true,
        notes: "i added this asset",
      };

      const addedAsset = await statement.addAsset(assetToAdd);

      expect(addedAsset).toMatchObject(assetToAdd);
      expect(statement.assets.length).toEqual(3);
      expect(statement.assets.at(-1)).toEqual(addedAsset._id);
    });

    it("deletes asset", async () => {
      const assetIds = statement.assets;
      const idToNotDelete = assetIds.at(0);
      const id = assetIds.at(-1);
      if (id === undefined || idToNotDelete === undefined) {
        fail("id is undefined. Test needs valid ids to start.");
      }

      const deleted = await statement.deleteAsset(id);

      const newAssets = statement.assets;
      expect(newAssets.length).toEqual(1);
      expect(newAssets.includes(id)).toBeFalsy();
      expect(newAssets.includes(idToNotDelete)).toBeTruthy();
      expect(deleted).toBeTruthy();
    });

    it("delete asset returns false if asset id does not exist", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const deleted = await statement.deleteAsset(invalidId);

      expect(statement.liabilities.length).toEqual(2);
      expect(deleted).toBeFalsy();
    });

    it("updates asset", async () => {
      const updateIndex = 0;
      const idToUpdate = statement.assets.at(updateIndex);

      if (!idToUpdate) {
        fail("Need valid id for this test");
      }

      const assetUpdates: AssetUpdate = {
        amount: 600,
        notes: "an updated asset",
        contribution: { amount: 100, selfContribution: false },
        amountOneYearAgo: 0,
        includeInGrowthCalculation: true,
      };

      const updatedAsset = await statement.updateAsset(
        idToUpdate,
        assetUpdates
      );

      const updatedAssetId = statement.assets.at(updateIndex);

      if (!updatedAsset) {
        fail("This test requires a valid id to update");
      }
      expect(updatedAssetId).toEqual(updatedAsset._id);
      expect(updatedAssetId).toEqual(idToUpdate);
      expect(updatedAsset).toMatchObject(assetUpdates);
    });

    it("returns null when trying to update invalid asset id", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const updatedLiability = await statement.updateAsset(invalidId, {
        amount: 600,
        notes: "an updated asset",
      });

      expect(updatedLiability).toBeNull();
    });
  });
});
