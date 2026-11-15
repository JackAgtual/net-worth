import {
  type Asset,
  type Liability,
  AssetCategory,
} from "@/generated/prisma/client";
import { Contributor, FullStatement } from "@/types/types";
import { Decimal } from "@prisma/client/runtime/client";
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
  let statement: FullStatement;
  const statementId = 1;

  beforeEach(() => {
    const assets: Asset[] = [
      {
        id: 1,
        statementId,
        title: "Savings",
        amount: Decimal(2_000),
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
        amount: Decimal(10_000),
        category: AssetCategory.CASH,
        amountOneYearAgo: Decimal(9_000),
        selfContributions: Decimal(250),
        nonSelfContributions: Decimal(250),
        includeInGrowthCalculation: false,
        notes: null,
        retirement: false,
        withdrawals: null,
      },
      {
        id: 3,
        statementId,
        title: "Tabxable individual",
        amount: Decimal(10_000),
        category: AssetCategory.AFTER_TAX,
        amountOneYearAgo: Decimal(5_000),
        includeInGrowthCalculation: true,
        selfContributions: Decimal(4_500),
        nonSelfContributions: Decimal(0),
        notes: null,
        retirement: false,
        withdrawals: null,
      },
      {
        id: 4,
        statementId,
        title: "Crypto",
        amount: Decimal(10_000),
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
        amount: Decimal(10_000),
        category: AssetCategory.TAX_DEFERRED,
        amountOneYearAgo: Decimal(7000),
        includeInGrowthCalculation: true,
        selfContributions: Decimal(0),
        nonSelfContributions: Decimal(1000),
        retirement: true,
        notes: null,
        withdrawals: null,
      },
      {
        id: 6,
        statementId,
        title: "Roth IRA",
        amount: Decimal(30_000),
        category: AssetCategory.TAX_FREE,
        includeInGrowthCalculation: true,
        amountOneYearAgo: Decimal(22_000),
        selfContributions: Decimal(6_500),
        nonSelfContributions: Decimal(0),
        retirement: true,
        notes: null,
        withdrawals: null,
      },
      {
        id: 7,
        statementId,
        title: "Roth 401k",
        amount: Decimal(80_000),
        category: AssetCategory.TAX_FREE,
        amountOneYearAgo: Decimal(50_000),
        includeInGrowthCalculation: true,
        selfContributions: Decimal(25_000),
        nonSelfContributions: Decimal(0),
        retirement: true,
        notes: null,
        withdrawals: null,
      },
    ];

    const liabilities: Liability[] = [
      {
        id: 1,
        statementId,
        title: "Liability 1",
        amount: Decimal(500),
        amountOneYearAgo: null,
        notes: null,
        paymentsMade: null,
      },
      {
        id: 2,
        statementId,
        title: "Liability 2",
        amount: Decimal(1234),
        amountOneYearAgo: null,
        notes: null,
        paymentsMade: null,
      },
    ];

    statement = {
      id: 1,
      userId: "abc-123",
      year: 2026,
      lastYearSalary: Decimal(100_000),
      assets,
      liabilities,
    };
  });

  it("getTotalAssetAmount sums all assets", () => {
    expect(getTotalAssetAmount(statement)).toEqual(Decimal(152_000));
  });

  it("getTotalLiabilityAmount sums all liabilities", () => {
    expect(getTotalLiabilityAmount(statement)).toEqual(Decimal(1734));
  });

  it("getNetWorth calculates net worth", () => {
    expect(getNetWorth(statement)).toEqual(Decimal(150_266));
  });

  describe("getTotalAssetAmountByCategory", () => {
    it("calculates CASH category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.CASH)
      ).toEqual(Decimal(12_000));
    });

    it("calculates after tax category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.AFTER_TAX)
      ).toEqual(Decimal(20_000));
    });

    it("calculates tax deferred category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.TAX_DEFERRED)
      ).toEqual(Decimal(10_000));
    });

    it("calculates tax free category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.TAX_FREE)
      ).toEqual(Decimal(110_000));
    });

    it("calculates property category", () => {
      expect(
        getTotalAssetAmountByCategory(statement, AssetCategory.PROPERTY)
      ).toEqual(Decimal(0));
    });
  });

  describe("getContributionAmountByContributor", () => {
    it("getContributionAmountByContributor calculates contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.Self)
      ).toEqual(Decimal(36_250));
    });

    it("calculates non self contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.NonSelf)
      ).toEqual(Decimal(1_250));
    });

    it("calculates all contributions", () => {
      expect(
        getContributionAmountByContributor(statement, Contributor.All)
      ).toEqual(Decimal(37_500));
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
      ).toEqual(Decimal(0.3625));
    });

    it("calculates contribution percent of salary for non self contributions", () => {
      expect(
        getContributioPercentOfSalaryByContributor(
          statement,
          Contributor.NonSelf
        )
      ).toEqual(Decimal(0.0125));
    });

    it("calculates contribution percent of salary for all contributions", () => {
      expect(
        getContributioPercentOfSalaryByContributor(statement, Contributor.All)
      ).toEqual(Decimal(0.375));
    });
  });

  describe("getLastYearAssetGrowth", () => {
    it("calculates last year asset growth", () => {
      expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(9_000));
    });

    describe("specific cases", () => {
      let asset: Asset;

      function buildStatement() {
        statement.assets = [asset];
      }

      beforeEach(() => {
        asset = {
          id: 1,
          statementId,
          title: "Savings",
          amount: Decimal(2_000),
          category: AssetCategory.CASH,
          includeInGrowthCalculation: true,
          amountOneYearAgo: Decimal(1_000),
          selfContributions: Decimal(100),
          nonSelfContributions: Decimal(0),
          notes: null,
          retirement: false,
          withdrawals: null,
        };
      });

      it("returns 0 if amountOneYearAgo is null", () => {
        asset.amountOneYearAgo = null;
        buildStatement();
        const ans = getLastYearAssetGrowth(statement);
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(0));
      });

      it("calculates without contribution", () => {
        asset.selfContributions = null;
        asset.nonSelfContributions = null;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(1_000));
      });

      it("checks for include in growth", () => {
        asset.includeInGrowthCalculation = false;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(0));

        asset.includeInGrowthCalculation = true;
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(900));
      });

      it("accounts for negative contribution and decrease in amount", () => {
        asset.selfContributions = Decimal(-100);
        asset.nonSelfContributions = Decimal(0);
        asset.amountOneYearAgo = Decimal(3_000);

        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(-900));
      });

      it("accounts for negative contribution and increase in amount", () => {
        asset.selfContributions = Decimal(-100);
        asset.nonSelfContributions = Decimal(0);
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(1_100));
      });

      it("accounts for positive contribution and increase in amount", () => {
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(900));
      });

      it("accounts for positive contribution and decrease in amount", () => {
        asset.amount = Decimal(800);
        buildStatement();
        expect(getLastYearAssetGrowth(statement)).toEqual(Decimal(-300));
      });
    });
  });

  describe("getLastYearAssetGrowthPercentOfSalary", () => {
    it("returns undefined if last year salary is null", () => {
      statement.lastYearSalary = null;

      expect(getLastYearAssetGrowthPercentOfSalary(statement)).toBeUndefined();
    });

    it("calculates correct value", () => {
      expect(getLastYearAssetGrowthPercentOfSalary(statement)).toEqual(
        Decimal(0.09)
      );
    });
  });

  describe("getTotalRetirementAssets", () => {
    it("calcultes correct value", () => {
      expect(getTotalRetirementAssets(statement)).toEqual(Decimal(120_000));
    });
  });

  describe("getRetirementAssetsByCategory", () => {
    it("returns 0 for category that does not exist as reitrement asset", () => {
      expect(
        getRetirementAssetsByCategory(statement, AssetCategory.PROPERTY)
      ).toEqual(Decimal(0));
    });

    it("calculates total amount for category that exists as retirement asset(s)", () => {
      expect(
        getRetirementAssetsByCategory(statement, AssetCategory.TAX_FREE)
      ).toEqual(Decimal(110_000));
    });
  });

  describe("getTotalWithdrawals", () => {
    it("returns 0 if no assets have withdrawals", () => {
      expect(getTotalWithdrawals(statement)).toEqual(Decimal(0));
    });

    it("sums withdrawals across all assets", () => {
      statement.assets[0].withdrawals = Decimal(500);
      statement.assets[1].withdrawals = Decimal(1000);

      expect(getTotalWithdrawals(statement)).toEqual(Decimal(1500));
    });

    it("treats undefined withdrawals as zero", () => {
      statement.assets[0].withdrawals = Decimal(300);

      expect(getTotalWithdrawals(statement)).toEqual(Decimal(300));
    });
  });

  describe("getNetContributions", () => {
    it("returns total contributions when there are no withdrawals", () => {
      expect(getNetContributions(statement)).toEqual(Decimal(37_500));
    });

    it("subtracts withdrawals from total contributions", () => {
      statement.assets[0].withdrawals = Decimal(500);

      expect(getNetContributions(statement)).toEqual(Decimal(37_000));
    });

    it("returns negative value if withdrawals exceed contributions", () => {
      statement.assets[0].withdrawals = Decimal(40_000);

      expect(getNetContributions(statement)).toEqual(Decimal(-2_500));
    });
  });

  describe("getPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getPercentOfSalary(Decimal(10_000), statement)).toBeUndefined();
    });

    it("calculates percent of salary", () => {
      expect(getPercentOfSalary(Decimal(25_000), statement)).toEqual(
        Decimal(0.25)
      );
    });
  });

  describe("getTotalWithdrawalsPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getTotalWithdrawalsPercentOfSalary(statement)).toBeUndefined();
    });

    it("returns 0 if there are no withdrawals", () => {
      expect(getTotalWithdrawalsPercentOfSalary(statement)).toEqual(Decimal(0));
    });

    it("calculates withdrawals as percent of salary", () => {
      statement.assets[0].withdrawals = Decimal(10_000);

      expect(getTotalWithdrawalsPercentOfSalary(statement)).toEqual(
        Decimal(0.1)
      );
    });
  });

  describe("getNetContributionsPercentOfSalary", () => {
    it("returns undefined if lastYearSalary is not set", () => {
      statement.lastYearSalary = null;
      expect(getNetContributionsPercentOfSalary(statement)).toBeUndefined();
    });

    it("calculates net contributions as percent of salary with no withdrawals", () => {
      expect(getNetContributionsPercentOfSalary(statement)).toEqual(
        Decimal(0.375)
      );
    });

    it("accounts for withdrawals when calculating percent of salary", () => {
      statement.assets[0].withdrawals = Decimal(7_500);

      expect(getNetContributionsPercentOfSalary(statement)).toEqual(
        Decimal(0.3)
      );
    });
  });

  // TODO: See if you need these methods or if prisma will handle them
  //   describe("CRUD assets and liabilities", () => {
  //     let assetsInput: AssetDoc[];
  //     let liabilitiesInput: LiabilityDoc[];
  //     beforeEach( () => {
  //       assetsInput = [
  //         {
  //           userId,
  //           title: "Asset 1",
  //           amount: 100,
  //           category: AssetCategory.CASH,
  //           contribution: {
  //             self: 20,
  //             nonSelf: 0,
  //           },
  //         },
  //         {
  //           userId,
  //           title: "Asset 2",
  //           amount: 300,
  //           category: AssetCategory.TAX_FREE,
  //         },
  //       ];
  //       const assets = await Asset.insertMany(assetsInput);

  //       liabilitiesInput = [
  //         {
  //           userId,
  //           title: "Liability 1",
  //           amount: 500,
  //         },
  //         {
  //           userId,
  //           title: "Liability 2",
  //           amount: 1000,
  //         },
  //       ];
  //       const liabilities = await Liability.insertMany(liabilitiesInput);

  //       statement = create(statement,{
  //         userId,
  //         year: 2026,
  //         lastYearSalary: 100_000,
  //         assets: assets.map((asset) => asset._id),
  //         liabilities: liabilities.map((liability) => liability._id),
  //       });
  //     });

  //     it("adds liability",  () => {
  //       const liability = {
  //         amount: 100,
  //         userId,
  //         title: "liability 3",
  //         notes: "my notes",
  //       };
  //       const addedLiability = addLiability(statement,liability);
  //       const id = addedLiability._id;

  //       expect(addedLiability).toMatchObject(liability);
  //       expect(statement.liabilities.length).toEqual(Decimal(3));
  //       expect(statement.liabilities.at(-1)).toEqual(Decimal(id));
  //     });

  //     it("adds multiple liabilities",  () => {
  //       const myStatement = create(statement,{
  //         userId,
  //         year: 2026,
  //       });

  //       await myStatement.addLiabilities(liabilitiesInput);

  //       expect(myStatement.liabilities.length).toEqual(Decimal(2));
  //       await myStatement.populate("liabilities");
  //       expect(myStatement.liabilities[0]).toMatchObject({
  //         userId,
  //         title: "Liability 1",
  //         amount: 500,
  //       });
  //       expect(myStatement.liabilities[1]).toMatchObject({
  //         userId,
  //         title: "Liability 2",
  //         amount: 1000,
  //       });
  //     });

  //     it("deletes liability",  () => {
  //       const liabilityIds = statement.liabilities;
  //       const idToNotDelete = liabilityIds.at(0);
  //       const id = liabilityIds.at(-1);
  //       if (id === undefined || idToNotDelete === undefined) {
  //         fail("id is undefined. Test needs valid ids to start.");
  //       }

  //       const deleted = deleteLiability(statement,id);

  //       const newLiabilities = statement.liabilities;
  //       expect(newLiabilities.length).toEqual(Decimal(1));
  //       expect(newLiabilities.includes(id)).toBeFalsy();
  //       expect(newLiabilities.includes(idToNotDelete)).toBeTruthy();
  //       expect(deleted).toBeTruthy();
  //     });

  //     it("delete liability returns false if liability id does not exist",  () => {
  //       const invalidId = new mongoose.Types.ObjectId();

  //       const deleted = deleteLiability(statement,invalidId);

  //       expect(statement.liabilities.length).toEqual(Decimal(2));
  //       expect(deleted).toBeFalsy();
  //     });

  //     it("updates liability",  () => {
  //       const updateIndex = 0;
  //       const idToUpdate = statement.liabilities.at(updateIndex);

  //       if (!idToUpdate) {
  //         fail("Need valid id for this test");
  //       }
  //       const liabilityUpdates: LiabilityUpdate = {
  //         amount: 600,
  //         notes: "an updated liability",
  //       };
  //       const updatedLiability = updateLiability(statement,
  //         idToUpdate,
  //         liabilityUpdates
  //       );

  //       const updatedLiabilityId = statement.liabilities.at(updateIndex);

  //       if (!updatedLiability) {
  //         fail("This test requires a valid id to update");
  //       }
  //       expect(updatedLiabilityId).toEqual(Decimal(updatedLiability)._id);
  //       expect(updatedLiabilityId).toEqual(Decimal(idToUpdate));
  //       expect(updatedLiability).toMatchObject(liabilityUpdates);
  //     });

  //     it("returns null when trying to update invalid liability id",  () => {
  //       const invalidId = new mongoose.Types.ObjectId();

  //       const updatedLiability = updateLiability(statement,invalidId, {
  //         amount: 600,
  //         notes: "an updated liability",
  //       });

  //       expect(updatedLiability).toBeNull();
  //     });

  //     it("adds asset",  () => {
  //       const assetToAdd: AssetDoc = {
  //         userId,
  //         title: "a new asset",
  //         amount: 1000,
  //         category: AssetCategory.CASH,
  //         contribution: { self: 100, nonSelf: 0 },
  //         retirement: false,
  //         amountOneYearAgo: 500,
  //         includeInGrowthCalculation: true,
  //         notes: "i added this asset",
  //       };

  //       const addedAsset = addAsset(statement,assetToAdd);

  //       expect(addedAsset).toMatchObject(assetToAdd);
  //       expect(statement.assets.length).toEqual(Decimal(3));
  //       expect(statement.assets.at(-1)).toEqual(Decimal(addedAsset)._id);
  //     });

  //     it("adds multiple assets",  () => {
  //       const myStatement = create(statement,{
  //         userId,
  //         year: 2026,
  //       });

  //       await myStatement.addAssets(assetsInput);

  //       expect(myStatement.assets.length).toEqual(Decimal(2));
  //       await myStatement.populate("assets");

  //       expect(myStatement.assets[0]).toMatchObject({
  //         userId,
  //         title: "Asset 1",
  //         amount: 100,
  //         category: AssetCategory.CASH,
  //       });
  //       expect(myStatement.assets[1]).toMatchObject({
  //         userId,
  //         title: "Asset 2",
  //         amount: 300,
  //         category: AssetCategory.TAX_FREE,
  //       });
  //     });

  //     it("deletes asset",  () => {
  //       const assetIds = statement.assets;
  //       const idToNotDelete = assetIds.at(0);
  //       const id = assetIds.at(-1);
  //       if (id === undefined || idToNotDelete === undefined) {
  //         fail("id is undefined. Test needs valid ids to start.");
  //       }

  //       const deleted = deleteAsset(statement,id);

  //       const newAssets = statement.assets;
  //       expect(newAssets.length).toEqual(Decimal(1));
  //       expect(newAssets.includes(id)).toBeFalsy();
  //       expect(newAssets.includes(idToNotDelete)).toBeTruthy();
  //       expect(deleted).toBeTruthy();
  //     });

  //     it("delete asset returns false if asset id does not exist",  () => {
  //       const invalidId = new mongoose.Types.ObjectId();

  //       const deleted = deleteAsset(statement,invalidId);

  //       expect(statement.liabilities.length).toEqual(Decimal(2));
  //       expect(deleted).toBeFalsy();
  //     });

  //     it("updates asset",  () => {
  //       const updateIndex = 0;
  //       const idToUpdate = statement.assets.at(updateIndex);

  //       if (!idToUpdate) {
  //         fail("Need valid id for this test");
  //       }

  //       const assetUpdates: AssetUpdate = {
  //         amount: 600,
  //         notes: "an updated asset",
  //         contribution: { nonSelf: 100, self: 0 },
  //         amountOneYearAgo: 0,
  //         includeInGrowthCalculation: true,
  //       };

  //       const updatedAsset = updateAsset(statement,
  //         idToUpdate,
  //         assetUpdates
  //       );

  //       const updatedAssetId = statement.assets.at(updateIndex);

  //       if (!updatedAsset) {
  //         fail("This test requires a valid id to update");
  //       }
  //       expect(updatedAssetId).toEqual(Decimal(updatedAsset)._id);
  //       expect(updatedAssetId).toEqual(Decimal(idToUpdate));
  //       expect(updatedAsset).toMatchObject(assetUpdates);
  //     });

  //     it("can remove fields when updating asset",  () => {
  //       const updateIndex = 0;
  //       const idToUpdate = statement.assets.at(updateIndex);

  //       if (!idToUpdate) {
  //         fail("Need valid id for this test");
  //       }

  //       const assetUpdates: AssetUpdate = {
  //         amount: 600,
  //         notes: "an updated asset",
  //         contribution: undefined,
  //         amountOneYearAgo: undefined,
  //         includeInGrowthCalculation: true,
  //       };

  //       const updatedAsset = updateAsset(statement,
  //         idToUpdate,
  //         assetUpdates
  //       );

  //       const updatedAssetId = statement.assets.at(updateIndex);

  //       if (!updatedAsset) {
  //         fail("This test requires a valid id to update");
  //       }

  //       const originalAsset = assetsInput[updateIndex];

  //       expect(updatedAssetId).toEqual(Decimal(updatedAsset)._id);
  //       expect(updatedAssetId).toEqual(Decimal(idToUpdate));
  //       expect(updatedAsset.contribution).toBeUndefined();
  //       expect(updatedAsset.amountOneYearAgo).toBeUndefined();
  //     });

  //     it("returns null when trying to update invalid asset id",  () => {
  //       const invalidId = new mongoose.Types.ObjectId();

  //       const updatedLiability = updateAsset(statement,invalidId, {
  //         amount: 600,
  //         notes: "an updated asset",
  //       });

  //       expect(updatedLiability).toBeNull();
  //     });
  //   });
});
