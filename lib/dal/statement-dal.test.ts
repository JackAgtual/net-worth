import { setupTestDb } from "@/tests/db-setup";
import { prisma } from "../db/prisma";
import { createUser, mockSession } from "@/tests/dal-helper";
import {
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

describe("statement-dal", () => {
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
