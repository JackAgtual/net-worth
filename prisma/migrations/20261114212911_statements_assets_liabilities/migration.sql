-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('CASH', 'AFTER_TAX', 'TAX_FREE', 'TAX_DEFERRED', 'PROPERTY');

-- CreateTable
CREATE TABLE "Statement" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastYearSalary" DECIMAL(10,2),

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liability" (
    "id" SERIAL NOT NULL,
    "statementId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "amountOneYearAgo" DECIMAL(10,2) NOT NULL,
    "paymentsMade" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Liability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "statementId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "includeInGrowthCalculation" BOOLEAN NOT NULL DEFAULT false,
    "amountOneYearAgo" DECIMAL(10,2),
    "selfContributions" DECIMAL(10,2),
    "nonSelfContributions" DECIMAL(10,2),
    "withdrawals" DECIMAL(10,2),
    "retirement" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liability" ADD CONSTRAINT "Liability_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
