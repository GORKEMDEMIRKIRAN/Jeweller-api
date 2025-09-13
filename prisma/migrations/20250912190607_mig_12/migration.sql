-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phoneCodeExpiresAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phoneVerificationCode" INTEGER DEFAULT 0;
