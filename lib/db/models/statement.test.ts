import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Asset, Liability, Statement } from ".";
import { Category } from "./asset";

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

    const assets = await Asset.insertMany([
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
        contributions: 500,
        selfContribution: true,
      },
      {
        title: "Tabxable individual",
        amount: 10_000,
        category: Category.AfterTax,
        contribution: {
          amountOneYearAgo: 5_000,
          contributions: 4_500,
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
        amount: 10_000,
        category: Category.TaxDeferred,
        contribution: {
          amountOneYearAgo: 7_000,
          contributions: 1_000,
          selfContribution: false,
        },
      },
      {
        title: "Roth IRA",
        amount: 30_000,
        category: Category.TaxFree,
        contribution: {
          amountOneYearAgo: 22_000,
          contributions: 6_500,
          selfContribution: true,
        },
      },
      {
        title: "Roth 401k",
        amount: 80_000,
        category: Category.TaxFree,
        contribution: {
          amountOneYearAgo: 50_000,
          contributions: 25_000,
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
    ]);

    const liabilities = await Liability.insertMany([
      {
        title: "Liability 1",
        amount: 500,
      },
      {
        title: "Liability 2",
        amount: 1234,
      },
    ]);

    statement = await Statement.create({
      year: 2026,
      lastYearSalary: 100000,
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

  it("getTotalAmountByCategory gets correct amount", async () => {
    expect(await statement.getTotalAmountByCategory(Category.Cash)).toEqual(
      12_000
    );

    expect(await statement.getTotalAmountByCategory(Category.AfterTax)).toEqual(
      20_000
    );

    expect(
      await statement.getTotalAmountByCategory(Category.TaxDeferred)
    ).toEqual(10_000);

    expect(await statement.getTotalAmountByCategory(Category.TaxFree)).toEqual(
      110_000
    );

    expect(await statement.getTotalAmountByCategory(Category.Property)).toEqual(
      0
    );
  });
});
