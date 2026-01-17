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

  const assetsInput1: AssetDoc[] = [
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

  const assetsInput2: AssetDoc[] = [
    {
      title: "Asset 1",
      amount: 200,
      category: Category.AfterTax,
    },
    {
      title: "Asset 2",
      amount: 9000,
      category: Category.Cash,
    },
    {
      title: "Asset 3",
      amount: 120000,
      category: Category.Property,
    },
    {
      title: "Asset 4",
      amount: 1300,
      category: Category.TaxFree,
      amountOneYearAgo: 1200,
      includeInGrowthCalculation: true,
      contribution: {
        amount: 400,
        selfContribution: false,
      },
    },
  ];

  const liabilitiesInput1: LiabilityDoc[] = [
    {
      title: "Liability 1",
      amount: 500,
    },
    {
      title: "Liability 2",
      amount: 1234,
    },
  ];
  const liabilitiesInput2: LiabilityDoc[] = [
    {
      title: "Liability 1",
      amount: 300,
    },
    {
      title: "Liability 2",
      amount: 1200,
    },
  ];

  const assets1 = await Asset.insertMany(assetsInput1);
  const liabilities1 = await Liability.insertMany(liabilitiesInput1);
  await Statement.create({
    year: 2025,
    lastYearSalary: 100000,
    assets: assets1.map((asset) => asset._id),
    liabilities: liabilities1.map((liability) => liability._id),
  });

  const assets2 = await Asset.insertMany(assetsInput2);
  const liabilities2 = await Liability.insertMany(liabilitiesInput2);
  await Statement.create({
    year: 2026,
    lastYearSalary: 105000,
    assets: assets2.map((asset) => asset._id),
    liabilities: liabilities2.map((liability) => liability._id),
  });

  console.log("seeded db");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
