/*
  Warnings:

  - A unique constraint covering the columns `[userId,year]` on the table `Statement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Statement_userId_year_key" ON "Statement"("userId", "year");
