/*
  Warnings:

  - You are about to drop the column `userId` on the `WireTransfer` table. All the data in the column will be lost.
  - Added the required column `feed` to the `WireTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `WireTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckTransactionType" ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WireTransfer" DROP COLUMN "userId",
ADD COLUMN     "feed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recipientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WireTransfer" ADD CONSTRAINT "WireTransfer_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
