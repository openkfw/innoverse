/*
  Warnings:

  - Added the required column `updatedAt` to the `collaboration_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `collaboration_comments_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `project_comments` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Follow" RENAME COLUMN "projectId" TO "objectId";
ALTER TABLE "Follow" ADD COLUMN "objectType" "ObjectType" DEFAULT 'PROJECT';

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "objectType" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Follow_objectId_objectType_followedBy_key" ON "Follow"("objectId", "objectType", "followedBy");

-- AlterTable
ALTER TABLE "collaboration_comments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "collaboration_comments_responses" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "project_comments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
