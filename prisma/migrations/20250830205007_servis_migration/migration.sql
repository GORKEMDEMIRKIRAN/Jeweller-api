/*
  Warnings:

  - You are about to drop the column `authToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "authToken",
ADD COLUMN     "accessToken" TEXT;
