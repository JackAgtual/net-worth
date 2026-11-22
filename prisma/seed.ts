import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { AssetCategory, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

const { CASH, AFTER_TAX, TAX_FREE, TAX_DEFERRED, PROPERTY } = AssetCategory;

type AssetSeed = Omit<Prisma.AssetUncheckedCreateInput, "statementId">;
type LiabilitySeed = Omit<Prisma.LiabilityUncheckedCreateInput, "statementId">;

type YearData = {
  year: number;
  lastYearSalary: number;
  assets: AssetSeed[];
  liabilities: LiabilitySeed[];
};

const testUserData = {
  name: "Bob Stone",
  email: "dev@gmail.com",
  password: "password",
};

const asset = (
  title: string,
  amount: number,
  category: AssetCategory,
  extra: Partial<AssetSeed> = {}
): AssetSeed => ({ title, amount, category, ...extra });

// Retirement accounts are always retirement + included in growth calculation
const retirement = (
  title: string,
  amount: number,
  category: AssetCategory,
  extra: Partial<AssetSeed> = {}
): AssetSeed =>
  asset(title, amount, category, {
    retirement: true,
    includeInGrowthCalculation: true,
    ...extra,
  });

const liability = (title: string, amount: number): LiabilitySeed => ({
  title,
  amount,
});

const data: YearData[] = [
  {
    year: 2010,
    lastYearSalary: 52000,
    assets: [
      asset("Checking Account", 3200, CASH, { withdrawals: 500 }),
      asset("Savings Account", 5800, CASH),
      retirement("401(k)", 3000, TAX_DEFERRED, { selfContributions: 2600 }),
      retirement("401(k) Company Match", 1500, TAX_DEFERRED, {
        nonSelfContributions: 2600,
      }),
      retirement("Roth IRA", 2000, TAX_FREE, { selfContributions: 2000 }),
      asset("Brokerage Account", 1500, AFTER_TAX),
    ],
    liabilities: [
      liability("Student Loan", 28000),
      liability("Car Loan", 12500),
      liability("Credit Card", 2400),
    ],
  },
  {
    year: 2011,
    lastYearSalary: 54000,
    assets: [
      asset("Checking Account", 3800, CASH),
      asset("Savings Account", 7200, CASH, { withdrawals: 1200 }),
      retirement("401(k)", 5600, TAX_DEFERRED, {
        amountOneYearAgo: 3000,
        selfContributions: 2700,
      }),
      retirement("401(k) Company Match", 2800, TAX_DEFERRED, {
        amountOneYearAgo: 1500,
        nonSelfContributions: 2700,
      }),
      retirement("Roth IRA", 4200, TAX_FREE, {
        amountOneYearAgo: 2000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 2200, AFTER_TAX),
    ],
    liabilities: [
      liability("Student Loan", 24500),
      liability("Car Loan", 9800),
      liability("Credit Card", 1800),
    ],
  },
  {
    year: 2012,
    lastYearSalary: 56500,
    assets: [
      asset("Checking Account", 4100, CASH),
      asset("Savings Account", 9500, CASH, { withdrawals: 2000 }),
      retirement("401(k)", 9200, TAX_DEFERRED, {
        amountOneYearAgo: 5600,
        selfContributions: 2825,
      }),
      retirement("401(k) Company Match", 4600, TAX_DEFERRED, {
        amountOneYearAgo: 2800,
        nonSelfContributions: 2825,
      }),
      retirement("Roth IRA", 7000, TAX_FREE, {
        amountOneYearAgo: 4200,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 4500, AFTER_TAX),
    ],
    liabilities: [
      liability("Student Loan", 20800),
      liability("Car Loan", 6900),
      liability("Credit Card", 950),
    ],
  },
  {
    year: 2013,
    lastYearSalary: 59000,
    assets: [
      asset("Checking Account", 5200, CASH),
      asset("Savings Account", 12000, CASH),
      retirement("401(k)", 14333, TAX_DEFERRED, {
        amountOneYearAgo: 9200,
        selfContributions: 2950,
      }),
      retirement("401(k) Company Match", 7167, TAX_DEFERRED, {
        amountOneYearAgo: 4600,
        nonSelfContributions: 2950,
      }),
      retirement("Roth IRA", 10800, TAX_FREE, {
        amountOneYearAgo: 7000,
        selfContributions: 2000,
      }),
      // down payment savings top-up
      asset("Brokerage Account", 8200, AFTER_TAX, { withdrawals: 3000 }),
    ],
    liabilities: [
      liability("Student Loan", 16900),
      liability("Car Loan", 3800),
      liability("Credit Card", 1200),
    ],
  },
  {
    year: 2014,
    lastYearSalary: 63000,
    assets: [
      asset("Checking Account", 6500, CASH),
      asset("Savings Account", 15000, CASH),
      retirement("401(k)", 20800, TAX_DEFERRED, {
        amountOneYearAgo: 14333,
        selfContributions: 3150,
      }),
      retirement("401(k) Company Match", 10400, TAX_DEFERRED, {
        amountOneYearAgo: 7167,
        nonSelfContributions: 3150,
      }),
      retirement("Roth IRA", 15500, TAX_FREE, {
        amountOneYearAgo: 10800,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 12000, AFTER_TAX),
      asset("Primary Residence", 220000, PROPERTY),
    ],
    liabilities: [
      liability("Student Loan", 12500),
      liability("Mortgage", 192000),
      liability("Credit Card", 2100),
    ],
  },
  {
    year: 2015,
    lastYearSalary: 67000,
    assets: [
      asset("Checking Account", 7200, CASH),
      asset("Savings Account", 18000, CASH),
      retirement("401(k)", 28000, TAX_DEFERRED, {
        amountOneYearAgo: 20800,
        selfContributions: 3350,
      }),
      retirement("401(k) Company Match", 14000, TAX_DEFERRED, {
        amountOneYearAgo: 10400,
        nonSelfContributions: 3350,
      }),
      retirement("Roth IRA", 20800, TAX_FREE, {
        amountOneYearAgo: 15500,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 16500, AFTER_TAX),
      asset("Primary Residence", 228000, PROPERTY),
    ],
    liabilities: [
      liability("Student Loan", 8000),
      liability("Mortgage", 187500),
      liability("Credit Card", 1500),
    ],
  },
  {
    year: 2016,
    lastYearSalary: 72000,
    assets: [
      asset("Checking Account", 8100, CASH),
      asset("Savings Account", 22000, CASH),
      retirement("401(k)", 36667, TAX_DEFERRED, {
        amountOneYearAgo: 28000,
        selfContributions: 3600,
      }),
      retirement("401(k) Company Match", 18333, TAX_DEFERRED, {
        amountOneYearAgo: 14000,
        nonSelfContributions: 3600,
      }),
      retirement("Roth IRA", 27500, TAX_FREE, {
        amountOneYearAgo: 20800,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 22000, AFTER_TAX, { withdrawals: 5000 }),
      asset("Primary Residence", 238000, PROPERTY),
    ],
    liabilities: [
      liability("Student Loan", 3200),
      liability("Mortgage", 182800),
      liability("Credit Card", 800),
    ],
  },
  {
    year: 2017,
    lastYearSalary: 78000,
    assets: [
      asset("Checking Account", 9500, CASH),
      asset("Savings Account", 26000, CASH),
      retirement("401(k)", 47333, TAX_DEFERRED, {
        amountOneYearAgo: 36667,
        selfContributions: 3900,
      }),
      retirement("401(k) Company Match", 23667, TAX_DEFERRED, {
        amountOneYearAgo: 18333,
        nonSelfContributions: 3900,
      }),
      retirement("Roth IRA", 35500, TAX_FREE, {
        amountOneYearAgo: 27500,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 31000, AFTER_TAX),
      asset("Primary Residence", 252000, PROPERTY),
      asset("Rental Property", 165000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 177800),
      liability("Rental Property Mortgage", 138000),
      liability("Credit Card", 1400),
    ],
  },
  {
    year: 2018,
    lastYearSalary: 84000,
    assets: [
      asset("Checking Account", 11000, CASH),
      asset("Savings Account", 30000, CASH),
      retirement("401(k)", 54667, TAX_DEFERRED, {
        amountOneYearAgo: 47333,
        selfContributions: 4200,
      }),
      retirement("401(k) Company Match", 27333, TAX_DEFERRED, {
        amountOneYearAgo: 23667,
        nonSelfContributions: 4200,
      }),
      retirement("Roth IRA", 40000, TAX_FREE, {
        amountOneYearAgo: 35500,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 36000, AFTER_TAX, { withdrawals: 8000 }),
      asset("Primary Residence", 265000, PROPERTY),
      asset("Rental Property", 172000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 172500),
      liability("Rental Property Mortgage", 133000),
      liability("Credit Card", 2200),
    ],
  },
  {
    year: 2019,
    lastYearSalary: 90000,
    assets: [
      asset("Checking Account", 13500, CASH),
      asset("Savings Account", 35000, CASH, { withdrawals: 4000 }),
      retirement("401(k)", 68667, TAX_DEFERRED, {
        amountOneYearAgo: 54667,
        selfContributions: 4500,
      }),
      retirement("401(k) Company Match", 34333, TAX_DEFERRED, {
        amountOneYearAgo: 27333,
        nonSelfContributions: 4500,
      }),
      retirement("Roth IRA", 51000, TAX_FREE, {
        amountOneYearAgo: 40000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 48000, AFTER_TAX),
      asset("HSA", 8500, TAX_FREE),
      asset("Primary Residence", 280000, PROPERTY),
      asset("Rental Property", 180000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 166800),
      liability("Rental Property Mortgage", 127800),
      liability("Credit Card", 1800),
    ],
  },
  {
    year: 2020,
    lastYearSalary: 95000,
    assets: [
      asset("Checking Account", 18000, CASH),
      asset("Savings Account", 52000, CASH),
      retirement("401(k)", 78667, TAX_DEFERRED, {
        amountOneYearAgo: 68667,
        selfContributions: 4750,
        withdrawals: 10000,
      }),
      retirement("401(k) Company Match", 39333, TAX_DEFERRED, {
        amountOneYearAgo: 34333,
        nonSelfContributions: 4750,
      }),
      retirement("Roth IRA", 62000, TAX_FREE, {
        amountOneYearAgo: 51000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 67000, AFTER_TAX),
      asset("HSA", 12000, TAX_FREE),
      asset("Primary Residence", 310000, PROPERTY),
      asset("Rental Property", 192000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 160800),
      liability("Rental Property Mortgage", 122400),
      liability("Credit Card", 900),
    ],
  },
  {
    year: 2021,
    lastYearSalary: 105000,
    assets: [
      asset("Checking Account", 22000, CASH),
      asset("Savings Account", 60000, CASH, { withdrawals: 6000 }),
      retirement("401(k)", 105333, TAX_DEFERRED, {
        amountOneYearAgo: 78667,
        selfContributions: 5250,
      }),
      retirement("401(k) Company Match", 52667, TAX_DEFERRED, {
        amountOneYearAgo: 39333,
        nonSelfContributions: 5250,
      }),
      retirement("Roth IRA", 84000, TAX_FREE, {
        amountOneYearAgo: 62000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 98000, AFTER_TAX),
      asset("HSA", 16500, TAX_FREE),
      asset("Primary Residence", 370000, PROPERTY),
      asset("Rental Property", 230000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 154500),
      liability("Rental Property Mortgage", 116700),
      liability("Credit Card", 3200),
    ],
  },
  {
    year: 2022,
    lastYearSalary: 115000,
    assets: [
      asset("Checking Account", 19000, CASH),
      asset("Savings Account", 55000, CASH),
      retirement("401(k)", 98667, TAX_DEFERRED, {
        amountOneYearAgo: 105333,
        selfContributions: 5750,
      }),
      retirement("401(k) Company Match", 49333, TAX_DEFERRED, {
        amountOneYearAgo: 52667,
        nonSelfContributions: 5750,
      }),
      retirement("Roth IRA", 74000, TAX_FREE, {
        amountOneYearAgo: 84000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 82000, AFTER_TAX),
      asset("HSA", 19000, TAX_FREE),
      asset("Primary Residence", 390000, PROPERTY),
      asset("Rental Property", 245000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 148000),
      liability("Rental Property Mortgage", 110800),
      liability("Credit Card", 4500),
      liability("HELOC", 22000),
    ],
  },
  {
    year: 2023,
    lastYearSalary: 122000,
    assets: [
      asset("Checking Account", 21000, CASH),
      asset("Savings Account", 62000, CASH),
      retirement("401(k)", 118667, TAX_DEFERRED, {
        amountOneYearAgo: 98667,
        selfContributions: 6100,
      }),
      retirement("401(k) Company Match", 59333, TAX_DEFERRED, {
        amountOneYearAgo: 49333,
        nonSelfContributions: 6100,
      }),
      retirement("Roth IRA", 92000, TAX_FREE, {
        amountOneYearAgo: 74000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 105000, AFTER_TAX, { withdrawals: 7500 }),
      asset("HSA", 23500, TAX_FREE),
      asset("Primary Residence", 405000, PROPERTY),
      asset("Rental Property", 258000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 141200),
      liability("Rental Property Mortgage", 104700),
      liability("Credit Card", 2800),
      liability("HELOC", 15000),
    ],
  },
  {
    year: 2024,
    lastYearSalary: 130000,
    assets: [
      asset("Checking Account", 25000, CASH),
      asset("Savings Account", 72000, CASH, { withdrawals: 5000 }),
      retirement("401(k)", 143333, TAX_DEFERRED, {
        amountOneYearAgo: 118667,
        selfContributions: 6500,
      }),
      retirement("401(k) Company Match", 71667, TAX_DEFERRED, {
        amountOneYearAgo: 59333,
        nonSelfContributions: 6500,
      }),
      retirement("Roth IRA", 115000, TAX_FREE, {
        amountOneYearAgo: 92000,
        selfContributions: 2000,
      }),
      asset("Brokerage Account", 138000, AFTER_TAX),
      asset("HSA", 28000, TAX_FREE),
      asset("Primary Residence", 425000, PROPERTY),
      asset("Rental Property", 272000, PROPERTY),
    ],
    liabilities: [
      liability("Mortgage", 134100),
      liability("Rental Property Mortgage", 98400),
      liability("Credit Card", 1900),
      liability("HELOC", 8000),
    ],
  },
];

async function seed() {
  await prisma.asset.deleteMany();
  await prisma.liability.deleteMany();
  await prisma.statement.deleteMany();

  await prisma.user.deleteMany({ where: { email: testUserData.email } });

  const userId = (await auth.api.signUpEmail({ body: testUserData })).user.id;

  for (const { year, lastYearSalary, assets, liabilities } of data) {
    await prisma.statement.create({
      data: {
        userId,
        year,
        lastYearSalary,
        assets: { create: assets },
        liabilities: { create: liabilities },
      },
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
