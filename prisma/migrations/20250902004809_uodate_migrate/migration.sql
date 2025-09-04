/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grossWeight" DOUBLE PRECISION,
ADD COLUMN     "netWeight" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION,
ADD COLUMN     "unitPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "name",
DROP COLUMN "productId",
DROP COLUMN "quantity";
