import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dbConnect from "./mongodb";
import { Asset, Liability, Statement } from "./models";

async function seed() {
  await dbConnect();

  await Asset.deleteMany();
  await Liability.deleteMany();
  await Statement.deleteMany();

  const assets = await Asset.insertMany([
    {
      title: "Asset 1",
      amount: 100,
      category: "After Tax",
    },
    {
      title: "Asset 2",
      amount: 10000,
      category: "Cash",
    },
    {
      title: "Asset 3",
      amount: 100000,
      category: "Property",
    },
    {
      title: "Asset 4",
      amount: 1200,
      category: "Tax free",
      deltaAmount: {
        amountOneYearAgo: 1000,
        contributions: 500,
        selfContribution: false,
      },
    },
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

  const statement = await Statement.create({
    year: 2026,
    lastYearSalary: 100000,
    assets: assets.map((asset) => asset._id),
    liabilities: liabilities.map((liability) => liability._id),
  });

  await statement.populate("assets");
  await statement.populate("liabilities");

  console.log(statement);
  console.log("Seeded db");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
