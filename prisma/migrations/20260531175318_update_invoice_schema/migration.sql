/*
  Warnings:

  - The values [LOCKED] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `serviceCode` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('DRAFT', 'PAID', 'UNPAID');
ALTER TABLE "Invoice" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Invoice" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
ALTER TABLE "Invoice" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_treatmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "serviceCode" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL,
ALTER COLUMN "treatmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
