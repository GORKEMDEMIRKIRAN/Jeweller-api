-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "isEmailVerified" DROP NOT NULL,
ALTER COLUMN "isPhoneVerified" DROP NOT NULL;
