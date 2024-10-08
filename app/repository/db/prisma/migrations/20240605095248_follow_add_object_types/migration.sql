/*
  Warnings:
  - A unique constraint covering the columns `[objectId,objectType,followedBy]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `objectId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectType` to the `Follow` table without a default value. This is not possible if the table is not empty.
*/
-- DropIndex
DROP INDEX "Follow_projectId_followedBy_key";

-- AlterEnum
ALTER TYPE "ReactionObjectType" RENAME TO "ObjectType";
ALTER TYPE "ObjectType" ADD VALUE 'PROJECT';


