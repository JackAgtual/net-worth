import {
  addAssetToStatement,
  removeAssetFromStatement,
  updateAssetOnStatement,
} from "@/lib/dal/asset-dal";
import { Asset, Statement } from "@/lib/db/models";
import {
  createStatement,
  mockSession,
  USER_A,
  USER_B,
} from "@/tests/dal-helper";
import { setupMongoTestDb } from "@/tests/setup-mongo";
import { AssetForm } from "../types/asset-types";
import { Category } from "../types/types";

setupMongoTestDb();

jest.mock("@/lib/auth/auth-utils");

const defaultAssetData: AssetForm = {
  title: "Savings Account",
  amount: 10000,
  category: Category.Cash,
};
const assetData: AssetForm = {
  title: "Brokerage Account",
  amount: 5000,
  category: Category.AfterTax,
};

async function createStatementWithAsset(userId: string, year: number) {
  const statement = await createStatement(userId, year);
  const asset = await Asset.create({ userId, ...defaultAssetData });
  statement.assets.push(asset._id);
  await statement.save();
  return { statement, asset };
}

describe("Asset DAL", () => {
  describe("addAssetToStatement", () => {
    it("creates an asset and adds it to the statement", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithAsset(USER_A, 2023);

      const asset = await addAssetToStatement(
        statement._id.toString(),
        assetData
      );

      expect(asset).not.toBeNull();
      expect(asset?.title).toBe(assetData.title);
      expect(asset?.amount).toBe(assetData.amount);

      const updatedStatement = await Statement.findById(statement._id);
      expect(updatedStatement?.assets).toHaveLength(2);
    });

    it("sets the userId from the session on the asset", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithAsset(USER_A, 2023);

      const asset = await addAssetToStatement(
        statement._id.toString(),
        assetData
      );

      expect(asset?.userId).toBe(USER_A);
    });

    it("does not modify existing assets", async () => {
      mockSession(USER_A);
      const { statement, asset: existing } = await createStatementWithAsset(
        USER_A,
        2023
      );

      await addAssetToStatement(statement._id.toString(), assetData);

      const unchangedAsset = await Asset.findById(existing._id);
      expect(unchangedAsset).toMatchObject(defaultAssetData);
    });

    it("returns null when statement does not exist", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithAsset(USER_A, 2023);
      await Statement.findByIdAndDelete(statement._id);

      const result = await addAssetToStatement(
        statement._id.toString(),
        assetData
      );

      expect(result).toBeNull();
    });

    it("returns null when statement belongs to another user", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithAsset(USER_B, 2023);

      const result = await addAssetToStatement(
        statement._id.toString(),
        assetData
      );

      expect(result).toBeNull();
    });
  });

  describe("removeAssetFromStatement", () => {
    let statement: InstanceType<typeof Statement>;
    let existing: InstanceType<typeof Asset>;
    let assetToRemove: InstanceType<typeof Asset>;

    beforeEach(async () => {
      mockSession(USER_A);
      const result = await createStatementWithAsset(USER_A, 2023);
      statement = result.statement;
      existing = result.asset;
      assetToRemove = await Asset.create({ userId: USER_A, ...assetData });
      statement.assets.push(assetToRemove._id);
      await statement.save();
    });

    it("deletes only the target asset", async () => {
      await removeAssetFromStatement(
        statement._id.toString(),
        assetToRemove._id.toString()
      );

      const updatedStatement = await Statement.findById(statement._id);
      expect(updatedStatement?.assets).toHaveLength(1);
      expect(updatedStatement?.assets[0].toString()).toBe(
        existing._id.toString()
      );
    });

    it("deletes the asset document", async () => {
      await removeAssetFromStatement(
        statement._id.toString(),
        assetToRemove._id.toString()
      );

      const deletedAsset = await Asset.findById(assetToRemove._id);
      expect(deletedAsset).toBeNull();
    });

    it("does not modify other asset documents", async () => {
      await removeAssetFromStatement(
        statement._id.toString(),
        assetToRemove._id.toString()
      );

      const unchangedAsset = await Asset.findById(existing._id);
      expect(unchangedAsset).toMatchObject(defaultAssetData);
    });

    it("returns false when asset does not exist", async () => {
      await Asset.findByIdAndDelete(assetToRemove._id);

      const result = await removeAssetFromStatement(
        statement._id.toString(),
        assetToRemove._id.toString()
      );

      expect(result).toBe(false);
    });

    it("returns null when statement does not exist", async () => {
      await Statement.findByIdAndDelete(statement._id);

      const result = await removeAssetFromStatement(
        statement._id.toString(),
        assetToRemove._id.toString()
      );

      expect(result).toBeNull();
    });
  });

  describe("updateAssetOnStatement", () => {
    let statement: InstanceType<typeof Statement>;
    let existing: InstanceType<typeof Asset>;
    let assetToUpdate: InstanceType<typeof Asset>;
    const updates = {
      title: "Roth IRA",
      amount: 8000,
      category: Category.TaxFree,
    };

    beforeEach(async () => {
      mockSession(USER_A);
      const result = await createStatementWithAsset(USER_A, 2023);
      statement = result.statement;
      existing = result.asset;
      assetToUpdate = await Asset.create({ userId: USER_A, ...assetData });
      statement.assets.push(assetToUpdate._id);
      await statement.save();
    });

    it("updates the target asset with new data", async () => {
      const updated = await updateAssetOnStatement(
        statement._id.toString(),
        assetToUpdate._id.toString(),
        updates
      );

      expect(updated).not.toBeNull();
      expect(updated).toMatchObject(updates);
    });

    it("does not modify other assets", async () => {
      await updateAssetOnStatement(
        statement._id.toString(),
        assetToUpdate._id.toString(),
        updates
      );

      const unchangedAsset = await Asset.findById(existing._id);
      expect(unchangedAsset).toMatchObject(defaultAssetData);
    });

    it("returns null when the asset is not on the statement", async () => {
      const { statement: otherStatement } = await createStatementWithAsset(
        USER_A,
        2022
      );

      const result = await updateAssetOnStatement(
        otherStatement._id.toString(),
        assetToUpdate._id.toString(),
        updates
      );

      expect(result).toBeNull();
    });

    it("returns null when statement does not exist", async () => {
      await Statement.findByIdAndDelete(statement._id);

      const result = await updateAssetOnStatement(
        statement._id.toString(),
        assetToUpdate._id.toString(),
        updates
      );

      expect(result).toBeNull();
    });
  });
});
