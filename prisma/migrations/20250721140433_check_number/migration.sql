/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `CheckTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CheckTransaction_number_key" ON "CheckTransaction"("number");
