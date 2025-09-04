/*
  Warnings:

  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `refreshToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `accessToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "accessToken" SET DATA TYPE VARCHAR(255);
