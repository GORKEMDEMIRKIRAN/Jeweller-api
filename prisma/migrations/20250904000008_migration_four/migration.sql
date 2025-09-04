/*
  Warnings:

  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `nameSurname` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "name",
DROP COLUMN "surname",
ADD COLUMN     "nameSurname" TEXT NOT NULL;
