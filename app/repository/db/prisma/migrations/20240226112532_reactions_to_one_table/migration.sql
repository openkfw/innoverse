/*
  Warnings:

  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReactionOnEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReactionOnUpdate` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReactionObjectType" AS ENUM ('UPDATE', 'EVENT');

-- DropForeignKey
ALTER TABLE "UserReactionOnEvent" DROP CONSTRAINT "UserReactionOnEvent_reactionShortCode_fkey";

-- DropForeignKey
ALTER TABLE "UserReactionOnUpdate" DROP CONSTRAINT "UserReactionOnUpdate_reactionShortCode_fkey";

-- DropTable
DROP TABLE "Reaction";

-- DropTable
DROP TABLE "UserReactionOnEvent";

-- DropTable
DROP TABLE "UserReactionOnUpdate";

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactedBy" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectType" "ReactionObjectType" NOT NULL,
    "shortCode" TEXT NOT NULL,
    "nativeSymbol" TEXT NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reactions_reactedBy_objectId_objectType_key" ON "reactions"("reactedBy", "objectId", "objectType");
