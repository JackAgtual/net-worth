import {
  getAllStatements,
  getStatementFromId,
  getStatementFromYear,
  statementYearAlreadyExists,
} from "@/lib/dal/statement-dal";
import {
  createStatement,
  mockSession,
  USER_A,
  USER_B,
} from "@/tests/dal-helper";
import { setupMongoTestDb } from "@/tests/setup-mongo";

setupMongoTestDb();

jest.mock("@/lib/auth/auth-utils");

describe("getAllStatements", () => {
  it("returns only statements belonging to the authenticated user", async () => {
    mockSession(USER_A);
    await createStatement(USER_A, 2023);
    await createStatement(USER_A, 2022);
    await createStatement(USER_B, 2021);

    const results = await getAllStatements();
    expect(results).toHaveLength(2);
    expect(results.every((s) => s.userId === USER_A)).toBe(true);
  });

  it("sorts ascending when sortAscending is true", async () => {
    mockSession(USER_A);
    await createStatement(USER_A, 2022);
    await createStatement(USER_A, 2023);
    await createStatement(USER_A, 2021);

    const results = await getAllStatements(true);
    expect(results.map((s) => s.year)).toEqual([2021, 2022, 2023]);
  });

  it("sorts descending when sortAscending is false", async () => {
    mockSession(USER_A);
    await createStatement(USER_A, 2021);
    await createStatement(USER_A, 2022);
    await createStatement(USER_A, 2023);

    const results = await getAllStatements(false);
    expect(results.map((s) => s.year)).toEqual([2023, 2022, 2021]);
  });

  it("returns empty array when user has no statements", async () => {
    mockSession(USER_A);
    const results = await getAllStatements();
    expect(results).toHaveLength(0);
  });
});

describe("getStatementFromYear", () => {
  it("returns the matching statement for the authenticated user", async () => {
    mockSession(USER_A);
    await createStatement(USER_A, 2023);

    const result = await getStatementFromYear(2023);
    expect(result).not.toBeNull();
    expect(result?.year).toBe(2023);
  });

  it("does not return a statement belonging to another user", async () => {
    mockSession(USER_A);
    await createStatement(USER_B, 2023);

    const result = await getStatementFromYear(2023);
    expect(result).toBeNull();
  });

  it("returns null when no statement exists for that year", async () => {
    mockSession(USER_A);
    const result = await getStatementFromYear(2023);
    expect(result).toBeNull();
  });
});

describe("getStatementFromId", () => {
  it("returns the statement by id for the authenticated user", async () => {
    mockSession(USER_A);
    const doc = await createStatement(USER_A, 2023);

    const result = await getStatementFromId(doc._id.toString());
    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(doc._id.toString());
  });

  it("does not return a statement owned by another user", async () => {
    mockSession(USER_A);
    const doc = await createStatement(USER_B, 2023);

    const result = await getStatementFromId(doc._id.toString());
    expect(result).toBeNull();
  });
});

describe("statementYearAlreadyExists", () => {
  it("returns true when a statement for that year exists", async () => {
    mockSession(USER_A);
    await createStatement(USER_A, 2023);

    const exists = await statementYearAlreadyExists(2023);
    expect(exists).toBe(true);
  });

  it("returns false when no statement exists for that year", async () => {
    mockSession(USER_A);
    const exists = await statementYearAlreadyExists(2023);
    expect(exists).toBe(false);
  });

  it("returns false when the year exists but belongs to another user", async () => {
    mockSession(USER_A);
    await createStatement(USER_B, 2023);

    const exists = await statementYearAlreadyExists(2023);
    expect(exists).toBe(false);
  });
});
