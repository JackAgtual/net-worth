import { AssetCategory } from "@/generated/prisma/enums";
import {
  createUser,
  logout,
  mockSession,
  nextRedirect,
} from "@/tests/dal-helper";
import { setupTestDb } from "@/tests/db-setup";
import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../db/prisma";
import { StatementForm } from "../types/statement-types";
import {
  createStatement,
  getAllStatements,
  getStatementFromId,
  getStatementFromYear,
  statementYearAlreadyExists,
} from "./statement-dal";

vi.mock("../db/prisma", async () => ({
  prisma: (await import("@/tests/db-setup")).testPrisma,
}));

vi.mock("../auth/auth-utils", () => ({
  getValidSessionOrRedirect: vi.fn(),
}));

setupTestDb();

describe("statement DAL", () => {
  describe("createStatement", () => {
    const data: StatementForm = {
      year: 2020,
      lastYearSalary: 100_000,
      assets: [
        {
          title: "a1",
          amount: 200,
          category: AssetCategory.CASH,
          includeInGrowthCalculation: false,
          retirement: false,
        },
        {
          title: "a2",
          amount: 1000,
          category: AssetCategory.TAX_DEFERRED,
          includeInGrowthCalculation: true,
          retirement: true,
        },
      ],
      liabilities: [{ title: "l1", amount: 1000, amountOneYearAgo: null }],
    };

    it("adds statement, assets, and liabilities to db", async () => {
      const user = await createUser();

      mockSession(user.id);

      await createStatement(data);

      const statements = await prisma.statement.findMany();
      const statement = statements.at(0);
      const assets = await prisma.asset.findMany();
      const liabilities = await prisma.liability.findMany();

      expect(statements.length).toBe(1);
      expect(statement).toMatchObject({
        userId: user.id,
        year: 2020,
        lastYearSalary: Decimal(100_000),
      });
      expect(assets.length).toBe(2);
      expect(assets).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            statementId: statement?.id,
            title: "a1",
            amount: Decimal(200),
            category: AssetCategory.CASH,
            includeInGrowthCalculation: false,
            retirement: false,
          }),
          expect.objectContaining({
            statementId: statement?.id,
            title: "a2",
            amount: Decimal(1000),
            category: AssetCategory.TAX_DEFERRED,
            includeInGrowthCalculation: true,
            retirement: true,
          }),
        ])
      );
      expect(liabilities.length).toBe(1);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(createStatement(data)).rejects.toThrow(nextRedirect);
    });
  });

  describe("getAllStatements", () => {
    it("only returns statements belonging to user", async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      const statementsInput = [
        { year: 2020, userId: user1.id },
        { year: 2021, userId: user1.id },
        { year: 2020, userId: user2.id },
      ];
      await prisma.statement.createMany({
        data: statementsInput,
      });

      mockSession(user1.id);

      const statements = await getAllStatements();

      expect(statements).toHaveLength(2);
      expect(statements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(statementsInput[0]),
          expect.objectContaining(statementsInput[1]),
        ])
      );
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(getAllStatements()).rejects.toThrow(nextRedirect);
    });

    it("returns empty array when user has no statements", async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      const statementsInput = [
        { year: 2020, userId: user2.id },
        { year: 2021, userId: user2.id },
        { year: 2022, userId: user2.id },
      ];
      await prisma.statement.createMany({
        data: statementsInput,
      });

      mockSession(user1.id);

      const statements = await getAllStatements();

      expect(statements).toHaveLength(0);
    });

    it("sorts in ascending order", async () => {
      const user = await createUser();

      const statementsInput = [
        { year: 2020, userId: user.id },
        { year: 2022, userId: user.id },
        { year: 2021, userId: user.id },
      ];
      await prisma.statement.createMany({
        data: statementsInput,
      });

      mockSession(user.id);

      const statements = await getAllStatements(true);

      expect(statements).toHaveLength(3);
      expect(statements).toMatchObject([
        statementsInput[0],
        statementsInput[2],
        statementsInput[1],
      ]);
    });

    it("sorts in descening order", async () => {
      const user = await createUser();

      const statementsInput = [
        { year: 2020, userId: user.id },
        { year: 2022, userId: user.id },
        { year: 2021, userId: user.id },
      ];
      await prisma.statement.createMany({
        data: statementsInput,
      });

      mockSession(user.id);

      const statements = await getAllStatements(true);

      expect(statements).toHaveLength(3);
      expect(statements).toMatchObject([
        statementsInput[0],
        statementsInput[2],
        statementsInput[1],
      ]);
    });
  });

  describe("getStatementsFromYear", () => {
    it("returns statement from correct user", async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      const statementsInput = [
        { year: 2020, userId: user1.id },
        { year: 2020, userId: user2.id },
      ];
      await prisma.statement.createMany({
        data: statementsInput,
      });

      mockSession(user1.id);

      const statement = await getStatementFromYear(2020);

      expect(statement).toMatchObject(statementsInput[0]);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(getStatementFromYear(2020)).rejects.toThrow(nextRedirect);
    });

    it("returns null when no statement exists for that year", async () => {
      const user = await createUser();

      await prisma.statement.create({
        data: { year: 2020, userId: user.id },
      });

      mockSession(user.id);

      const result = await getStatementFromYear(2023);
      expect(result).toBeNull();
    });
  });

  describe("getStatementFromId", () => {
    it("returns the statement by id for the authenticated user", async () => {
      const user = await createUser();

      const savedStatement = await prisma.statement.create({
        data: { year: 2020, userId: user.id },
        include: { assets: true, liabilities: true },
      });

      mockSession(user.id);

      const statement = await getStatementFromId(savedStatement.id);

      expect(statement).toEqual(savedStatement);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(getStatementFromId(1)).rejects.toThrow(nextRedirect);
    });

    it("returns null statement is owned by another user", async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      const savedStatement = await prisma.statement.create({
        data: { year: 2020, userId: user1.id },
        include: { assets: true, liabilities: true },
      });

      mockSession(user2.id);

      const statement = await getStatementFromId(savedStatement.id);

      expect(statement).toBeNull();
    });
  });

  describe("statementYearAlreadyExists", () => {
    it("returns true when a statement for that year exists", async () => {
      const user = await createUser();

      await prisma.statement.create({
        data: { year: 2020, userId: user.id },
      });

      mockSession(user.id);

      const exists = await statementYearAlreadyExists(2020);

      expect(exists).toBe(true);
    });

    it("throws error if unauthenticated", async () => {
      logout();

      await expect(statementYearAlreadyExists(2020)).rejects.toThrow(
        nextRedirect
      );
    });

    it("returns false when no statement exists for that year", async () => {
      const user = await createUser();

      await prisma.statement.create({
        data: { year: 2020, userId: user.id },
      });

      mockSession(user.id);

      const exists = await statementYearAlreadyExists(2021);

      expect(exists).toBe(false);
    });

    it("returns false when the year exists but belongs to another user", async () => {
      const user1 = await createUser();
      const user2 = await createUser();

      await prisma.statement.create({
        data: { year: 2020, userId: user1.id },
      });

      mockSession(user2.id);

      const exists = await statementYearAlreadyExists(2020);

      expect(exists).toBe(false);
    });
  });
});
