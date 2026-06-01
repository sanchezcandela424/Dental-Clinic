/*
  Warnings:

  - You are about to drop the column `priceSnapshot` on the `InvoiceItem` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "priceSnapshot",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
