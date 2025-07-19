/*
  Warnings:

  - You are about to drop the column `statusId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `CustomerStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_statusId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerStatus" DROP CONSTRAINT "CustomerStatus_createdById_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "statusId";

-- DropTable
DROP TABLE "CustomerStatus";
