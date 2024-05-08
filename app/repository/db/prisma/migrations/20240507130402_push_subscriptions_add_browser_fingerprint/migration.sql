/*
  Warnings:

  - A unique constraint covering the columns `[userId,browserFingerprint]` on the table `PushSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PushSubscription" ADD COLUMN     "browserFingerprint" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_browserFingerprint_key" ON "PushSubscription"("userId", "browserFingerprint");
