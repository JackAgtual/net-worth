import {
  addLiabilityToStatement,
  removeLiabilityFromStatement,
  updateLiabilityOnStatement,
} from "@/lib/dal/liability-dal";
import { Liability, Statement } from "@/lib/db/models";
import {
  createStatement,
  mockSession,
  USER_A,
  USER_B,
} from "@/tests/dal-helper";
import { setupMongoTestDb } from "@/tests/setup-mongo";

setupMongoTestDb();

jest.mock("@/lib/auth/auth-utils");

const defaultLiabilityData = { title: "Mortgage", amount: 150000 };
const liabilityData = { title: "Car Loan", amount: 10000 };

async function createStatementWithLiability(userId: string, year: number) {
  const statement = await createStatement(userId, year);
  const liability = await Liability.create({ userId, ...defaultLiabilityData });
  statement.liabilities.push(liability._id);
  await statement.save();
  return { statement, liability };
}
describe("Statement DAL", () => {
  describe("addLiabilityToStatement", () => {
    it("creates a liability and adds it to the statement", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);

      const liability = await addLiabilityToStatement(
        statement._id.toString(),
        liabilityData
      );

      expect(liability).not.toBeNull();
      expect(liability?.title).toBe(liabilityData.title);
      expect(liability?.amount).toBe(liabilityData.amount);

      const updatedStatement = await Statement.findById(statement._id);
      expect(updatedStatement?.liabilities).toHaveLength(2);
    });

    it("sets the userId from the session on the liability", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);

      const liability = await addLiabilityToStatement(
        statement._id.toString(),
        liabilityData
      );

      expect(liability?.userId).toBe(USER_A);
    });

    it("does not modify existing liabilities", async () => {
      mockSession(USER_A);
      const { statement, liability: existing } =
        await createStatementWithLiability(USER_A, 2023);

      await addLiabilityToStatement(statement._id.toString(), liabilityData);

      const unchangedLiability = await Liability.findById(existing._id);
      expect(unchangedLiability?.title).toBe(defaultLiabilityData.title);
      expect(unchangedLiability?.amount).toBe(defaultLiabilityData.amount);
    });

    it("returns null when statement does not exist", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);
      await Statement.findByIdAndDelete(statement._id);

      const result = await addLiabilityToStatement(
        statement._id.toString(),
        liabilityData
      );

      expect(result).toBeNull();
    });

    it("returns null when statement belongs to another user", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_B, 2023);

      const result = await addLiabilityToStatement(
        statement._id.toString(),
        liabilityData
      );

      expect(result).toBeNull();
    });
  });

  describe("removeLiabilityFromStatement", () => {
    it("deletes only the target liability", async () => {
      mockSession(USER_A);
      const { statement, liability: existing } =
        await createStatementWithLiability(USER_A, 2023);
      const liabilityToDelete = await Liability.create({
        userId: USER_A,
        ...liabilityData,
      });
      statement.liabilities.push(liabilityToDelete._id);
      await statement.save();

      await removeLiabilityFromStatement(
        statement._id.toString(),
        liabilityToDelete._id.toString()
      );

      const updatedStatement = await Statement.findById(statement._id);
      expect(updatedStatement?.liabilities).toHaveLength(1);
      expect(updatedStatement?.liabilities[0].toString()).toBe(
        existing._id.toString()
      );
    });

    it("deletes the liability document", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);
      const liabilityToDelete = await Liability.create({
        userId: USER_A,
        ...liabilityData,
      });
      statement.liabilities.push(liabilityToDelete._id);
      await statement.save();

      await removeLiabilityFromStatement(
        statement._id.toString(),
        liabilityToDelete._id.toString()
      );

      const deletedLiability = await Liability.findById(liabilityToDelete._id);
      expect(deletedLiability).toBeNull();
    });

    it("does not modify other liability documents", async () => {
      mockSession(USER_A);
      const { statement, liability: existing } =
        await createStatementWithLiability(USER_A, 2023);
      const liabilityToDelete = await Liability.create({
        userId: USER_A,
        ...liabilityData,
      });
      statement.liabilities.push(liabilityToDelete._id);
      await statement.save();

      await removeLiabilityFromStatement(
        statement._id.toString(),
        liabilityToDelete._id.toString()
      );

      const unchangedLiability = await Liability.findById(existing._id);
      expect(unchangedLiability).toMatchObject(defaultLiabilityData);
    });

    it("returns false when liability does not exist", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);
      const liability = await Liability.create({
        userId: USER_A,
        ...liabilityData,
      });
      statement.liabilities.push(liability._id);
      await statement.save();

      await Liability.findByIdAndDelete(liability._id);

      const result = await removeLiabilityFromStatement(
        statement._id.toString(),
        liability._id.toString()
      );

      expect(result).toBe(false);
    });

    it("returns null when statement does not exist", async () => {
      mockSession(USER_A);
      const { statement } = await createStatementWithLiability(USER_A, 2023);
      await Statement.findByIdAndDelete(statement._id);

      const result = await removeLiabilityFromStatement(
        statement._id.toString(),
        "some-liability-id"
      );

      expect(result).toBeNull();
    });
  });

  describe("updateLiabilityOnStatement", () => {
    let statement: InstanceType<typeof Statement>;
    let existing: InstanceType<typeof Liability>;
    let liabilityToUpdate: InstanceType<typeof Liability>;

    beforeEach(async () => {
      mockSession(USER_A);
      const result = await createStatementWithLiability(USER_A, 2023);
      statement = result.statement;
      existing = result.liability;
      liabilityToUpdate = await Liability.create({
        userId: USER_A,
        ...liabilityData,
      });
      statement.liabilities.push(liabilityToUpdate._id);
      await statement.save();
    });

    it("updates the target liability with new data", async () => {
      const updated = await updateLiabilityOnStatement(
        statement._id.toString(),
        liabilityToUpdate._id.toString(),
        { title: "Personal Loan", amount: 5000 }
      );

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe("Personal Loan");
      expect(updated?.amount).toBe(5000);
    });

    it("does not modify other liabilities", async () => {
      await updateLiabilityOnStatement(
        statement._id.toString(),
        liabilityToUpdate._id.toString(),
        { title: "Personal Loan", amount: 5000 }
      );

      const unchangedLiability = await Liability.findById(existing._id);
      expect(unchangedLiability).toMatchObject(defaultLiabilityData);
    });

    it("returns null when the liability is not on the statement", async () => {
      const { statement: otherStatement } = await createStatementWithLiability(
        USER_A,
        2022
      );

      const result = await updateLiabilityOnStatement(
        otherStatement._id.toString(),
        liabilityToUpdate._id.toString(),
        { title: "Personal Loan", amount: 5000 }
      );

      expect(result).toBeNull();
    });

    it("returns null when statement does not exist", async () => {
      await Statement.findByIdAndDelete(statement._id);

      const result = await updateLiabilityOnStatement(
        statement._id.toString(),
        liabilityToUpdate._id.toString(),
        { title: "Personal Loan", amount: 5000 }
      );

      expect(result).toBeNull();
    });
  });
});
