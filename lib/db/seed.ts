import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dbConnect from "./mongodb";
import { Asset } from "./asset";

async function seed() {
  await dbConnect();

  await Asset.deleteMany();

  await Asset.insertMany([
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
      amountOneYearAgo: 1000,
      contributions: 500,
    },
  ]);

  console.log("Seeded db");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
