import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dbConnect from "./mongodb";
import {
  Asset,
  Liability,
  Statement,
  Category,
  AssetDoc,
  LiabilityDoc,
} from "./models";

async function seed() {
  await dbConnect();

  await Asset.deleteMany();
  await Liability.deleteMany();
  await Statement.deleteMany();

  const assetsInput: AssetDoc[] = [
    {
      title: "Asset 1",
      amount: 100,
      category: Category.AfterTax,
    },
    {
      title: "Asset 2",
      amount: 10000,
      category: Category.Cash,
    },
    {
      title: "Asset 3",
      amount: 100000,
      category: Category.Property,
    },
    {
      title: "Asset 4",
      amount: 1200,
      category: Category.TaxFree,
      amountOneYearAgo: 1000,
      includeInGrowthCalculation: true,
      contribution: {
        amount: 500,
        selfContribution: false,
      },
    },
  ];
  const assets = await Asset.insertMany(assetsInput);

  const liabilitiesInput: LiabilityDoc[] = [
    {
      title: "Liability 1",
      amount: 500,
    },
    {
      title: "Liability 2",
      amount: 1234,
    },
  ];
  const liabilities = await Liability.insertMany(liabilitiesInput);

  await Statement.create({
    year: 2026,
    lastYearSalary: 100000,
    assets: assets.map((asset) => asset._id),
    liabilities: liabilities.map((liability) => liability._id),
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
