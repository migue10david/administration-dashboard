-- AlterTable
ALTER TABLE "City" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
