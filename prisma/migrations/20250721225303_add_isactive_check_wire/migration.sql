-- AlterTable
ALTER TABLE "CheckTransaction" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "WireTransfer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
