/*
  Warnings:

  - You are about to drop the column `comision` on the `CheckTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `CheckTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CheckTransaction` table. All the data in the column will be lost.
  - Added the required column `comment` to the `CheckTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feed` to the `CheckTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `CheckTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckTransaction" DROP COLUMN "comision",
DROP COLUMN "numero",
DROP COLUMN "userId",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "feed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL;
