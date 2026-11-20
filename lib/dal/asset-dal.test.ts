import { Asset, Statement, User } from "@/generated/prisma/client";
import { AssetCategory } from "@/generated/prisma/enums";
import { AssetInputType } from "@/generated/prisma/schemas";
import {
  addAssetToStatement,
  deleteAsset,
  updateAsset,
} from "@/lib/dal/asset-dal";
import {
  createStatement,
  createUser,
  logout,
  mockSession,
  nextRedirect,
} from "@/tests/dal-helper";
import { setupTestDb } from "@/tests/db-setup";
import { prisma } from "../db/prisma";

vi.mock("../db/prisma", async () => ({
  prisma: (await import("@/tests/db-setup")).testPrisma,
}));

vi.mock("../auth/auth-utils", () => ({
  getValidSessionOrRedirect: vi.fn(),
}));

setupTestDb();

describe("Asset DAL", () => {
  let user: User;
  let statement: Statement;
  let existingAsset1: Asset;
  let existingAsset2: Asset;

  beforeEach(async () => {
    user = await createUser();

    mockSession(user.id);

    statement = await createStatement(user.id, 2020);
    existingAsset1 = await prisma.asset.create({
      data: {
        statementId: statement.id,
        title: "Asset 1",
        amount: 200,
        category: AssetCategory.CASH,
      },
    });
    existingAsset2 = await prisma.asset.create({
      data: {
        statementId: statement.id,
        title: "Asset 2",
        amount: 300,
        category: AssetCategory.TAX_DEFERRED,
      },
    });
  });

  describe("addAssetToStatement", () => {
    const assetData: AssetInputType = {
      title: "Brokerage Account",
      amount: 5000,
      category: AssetCategory.AFTER_TAX,
      statement: null,
      includeInGrowthCalculation: false,
      retirement: false,
      amountOneYearAgo: null,
      nonSelfContributions: null,
      notes: null,
      selfContributions: null,
      withdrawals: null,
    };

    it("creates an asset and adds it to the statement", async () => {
      const asset = await addAssetToStatement(statement.id, assetData);

      expect(asset).not.toBeNull();
      expect(asset?.statementId).toEqual(statement.id);
      expect(asset?.title).toBe(assetData.title);
      expect(asset?.amount.toNumber()).toBe(assetData.amount);
      expect(asset?.category).toBe(assetData.category);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(
        addAssetToStatement(statement.id, assetData)
      ).rejects.toThrow(nextRedirect);

      expect(await prisma.asset.count()).toBe(2);
    });

    it("returns null when statement does not exist", async () => {
      const asset = await addAssetToStatement(9999, assetData);

      expect(asset).toBeNull();
    });

    it("returns null when statement belongs to another user", async () => {
      const otherUser = await createUser();

      mockSession(otherUser.id);

      const asset = await addAssetToStatement(9999, assetData);

      expect(asset).toBeNull();
    });
  });

  describe("deleteAsset", () => {
    it("deletes only the target asset", async () => {
      const deleted = await deleteAsset(existingAsset1.id);
      const assets = await prisma.asset.findMany();

      expect(deleted).toBeTruthy();
      expect(assets.length).toEqual(1);
      expect(assets.at(0)?.id).toEqual(existingAsset2.id);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(deleteAsset(existingAsset1.id)).rejects.toThrow(
        nextRedirect
      );
      expect(await prisma.asset.count()).toBe(2);
    });

    it("returns false when asset does not exist", async () => {
      const deleted = await deleteAsset(999);
      const assets = await prisma.asset.findMany();

      expect(deleted).toBeFalsy();
      expect(assets.length).toEqual(2);
    });

    it("does not allow user to delete a different user's asset", async () => {
      const otherUser = await createUser();
      mockSession(otherUser.id);

      const deleted = await deleteAsset(existingAsset1.id);

      const assets = await prisma.asset.findMany();

      expect(deleted).toBeFalsy();
      expect(assets.length).toEqual(2);
    });
  });

  describe("updateAsset", () => {
    it("updates the target asset with new data", async () => {
      const updates: Asset = {
        ...existingAsset1,
        category: AssetCategory.PROPERTY,
        title: "Asset 1 updated",
      };

      const wasUpdated = await updateAsset(updates);
      const updatedAsset = await prisma.asset.findUnique({
        where: { id: existingAsset1.id },
      });

      expect(wasUpdated).toBeTruthy();
      expect(updatedAsset).not.toBeNull();
      expect(updatedAsset).toStrictEqual(updates);
    });

    it("throws error if unauthenticated", async () => {
      const updates: Asset = {
        ...existingAsset1,
        category: AssetCategory.PROPERTY,
        title: "Asset 1 updated",
      };

      logout();

      await expect(updateAsset(updates)).rejects.toThrow(nextRedirect);

      expect(await prisma.asset.count()).toBe(2);
    });

    it("does not modify other assets", async () => {
      const updates: Asset = {
        ...existingAsset1,
        category: AssetCategory.PROPERTY,
        title: "Asset 1 updated",
      };

      await updateAsset(updates);
      const unAffectedAsset = await prisma.asset.findUnique({
        where: { id: existingAsset2.id },
      });

      expect(unAffectedAsset).not.toBeNull();
      expect(unAffectedAsset).toStrictEqual(existingAsset2);
    });

    it("throws error if asset does not exist", async () => {
      const updates: Asset = {
        ...existingAsset1,
        id: 9999,
        category: AssetCategory.PROPERTY,
        title: "Asset 1 updated",
      };

      await expect(updateAsset(updates)).rejects.toThrow();
    });

    it("throws error if asset id doesn't belong to statement id", async () => {
      const updates: Asset = {
        ...existingAsset1,
        statementId: 999,
      };

      await expect(updateAsset(updates)).rejects.toThrow();
    });
  });
});
