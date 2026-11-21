import { Liability, Statement, User } from "@/generated/prisma/client";
import {
  addLiabilityToStatement,
  deleteLiability,
  updateLiability,
} from "@/lib/dal/liability-dal";
import {
  createStatement,
  createUser,
  logout,
  mockSession,
  nextRedirect,
} from "@/tests/dal-helper";
import { setupTestDb } from "@/tests/db-setup";
import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../db/prisma";
import { LiabilityForm } from "../types/liability-types";

vi.mock("../db/prisma", async () => ({
  prisma: (await import("@/tests/db-setup")).testPrisma,
}));

vi.mock("../auth/auth-utils", () => ({
  getValidSessionOrRedirect: vi.fn(),
}));

setupTestDb();

describe("Liability DAL", () => {
  let user: User;
  let statement: Statement;
  let existingLiability1: Liability;
  let existingLiability2: Liability;

  beforeEach(async () => {
    user = await createUser();

    mockSession(user.id);

    statement = await createStatement(user.id, 2020);

    existingLiability1 = await prisma.liability.create({
      data: {
        statementId: statement.id,
        title: "Liability 1",
        amount: 200,
      },
    });
    existingLiability2 = await prisma.liability.create({
      data: {
        statementId: statement.id,
        title: "Liability 2",
        amount: 300,
      },
    });
  });

  describe("addLiabilityToStatement", () => {
    const liabilityData: LiabilityForm = {
      title: "Credit card",
      amount: 500,
      amountOneYearAgo: null,
      notes: null,
      paymentsMade: null,
    };

    it("creates a liability and adds it to the statement", async () => {
      const liability = await addLiabilityToStatement(
        statement.id,
        liabilityData
      );

      expect(liability).not.toBeNull();
      expect(liability?.statementId).toEqual(statement.id);
      expect(liability?.title).toBe(liabilityData.title);
      expect(liability?.amount.toNumber()).toBe(liabilityData.amount);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(
        addLiabilityToStatement(statement.id, liabilityData)
      ).rejects.toThrow(nextRedirect);

      expect(await prisma.liability.count()).toBe(2);
    });

    it("returns null when statement does not exist", async () => {
      const liability = await addLiabilityToStatement(9999, liabilityData);

      expect(liability).toBeNull();
    });

    it("returns null when statement belongs to another user", async () => {
      const otherUser = await createUser();

      mockSession(otherUser.id);

      const liability = await addLiabilityToStatement(9999, liabilityData);

      expect(liability).toBeNull();
    });
  });

  describe("deleteLiability", () => {
    it("deletes only the target liability", async () => {
      const deleted = await deleteLiability(existingLiability1.id);
      const liabilities = await prisma.liability.findMany();

      expect(deleted).toBeTruthy();
      expect(liabilities.length).toEqual(1);
      expect(liabilities.at(0)?.id).toEqual(existingLiability2.id);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(deleteLiability(existingLiability1.id)).rejects.toThrow(
        nextRedirect
      );
      expect(await prisma.liability.count()).toBe(2);
    });

    it("returns false when liability does not exist", async () => {
      const deleted = await deleteLiability(999);
      const liabilities = await prisma.liability.findMany();

      expect(deleted).toBeFalsy();
      expect(liabilities.length).toEqual(2);
    });

    it("does not allow user to delete a different user's liability", async () => {
      const otherUser = await createUser();
      mockSession(otherUser.id);

      const deleted = await deleteLiability(existingLiability1.id);

      const assets = await prisma.liability.findMany();

      expect(deleted).toBeFalsy();
      expect(assets.length).toEqual(2);
    });
  });

  describe("updateAsset", () => {
    const updates: LiabilityForm = {
      title: "Liability 1 updated",
      amount: 125,
      amountOneYearAgo: 200,
      paymentsMade: 100,
      notes: "Some notes",
    };

    it("updates the target liability with new data", async () => {
      const wasUpdated = await updateLiability(existingLiability1.id, updates);
      const updatedLiability = await prisma.liability.findUnique({
        where: { id: existingLiability1.id },
      });

      expect(wasUpdated).toBeTruthy();
      expect(updatedLiability).not.toBeNull();
      expect(updatedLiability).toMatchObject({
        ...updates,
        amount: Decimal(updates.amount),
        amountOneYearAgo: Decimal(updates.amountOneYearAgo ?? 0),
        paymentsMade: Decimal(updates.paymentsMade ?? 0),
      });
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(
        updateLiability(existingLiability1.id, updates)
      ).rejects.toThrow(nextRedirect);

      expect(await prisma.liability.count()).toBe(2);
    });

    it("does not modify other assets", async () => {
      await updateLiability(existingLiability1.id, updates);
      const unAffectedAsset = await prisma.liability.findUnique({
        where: { id: existingLiability2.id },
      });

      expect(unAffectedAsset).not.toBeNull();
      expect(unAffectedAsset).toStrictEqual(existingLiability2);
    });

    it("throws error if liability does not exist", async () => {
      await expect(updateLiability(999, updates)).rejects.toThrow();
    });
  });
});
