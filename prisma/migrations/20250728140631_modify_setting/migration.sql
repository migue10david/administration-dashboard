/*
  Warnings:

  - A unique constraint covering the columns `[cityId]` on the table `SystemSetting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stateId]` on the table `SystemSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SystemSetting" DROP CONSTRAINT "SystemSetting_cityId_fkey";

-- DropForeignKey
ALTER TABLE "SystemSetting" DROP CONSTRAINT "SystemSetting_stateId_fkey";

-- AlterTable
ALTER TABLE "SystemSetting" ALTER COLUMN "cityId" DROP NOT NULL,
ALTER COLUMN "stateId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_cityId_key" ON "SystemSetting"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_stateId_key" ON "SystemSetting"("stateId");

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;
