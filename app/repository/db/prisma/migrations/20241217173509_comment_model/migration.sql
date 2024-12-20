/*
  Warnings:

  - The values [COLLABORATION_COMMENT] on the enum `ObjectType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `upvotedBy` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `upvotedBy` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `NewsComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collaboration_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collaboration_comments_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_comments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[objectId,likedBy]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - The required column `objectId` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `objectType` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `objectId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectType` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "upvotedBy",
ADD COLUMN     "additionalObjectId" TEXT,
ADD COLUMN     "anonymous" BOOLEAN,
ADD COLUMN     "objectId" TEXT;

CREATE TYPE "ObjectType_new" AS ENUM ('UPDATE', 'EVENT', 'COLLABORATION_QUESTION', 'POST', 'PROJECT', 'SURVEY_QUESTION', 'COMMENT');
ALTER TABLE "Follow" ALTER COLUMN "objectType" DROP DEFAULT;
ALTER TABLE "Comment" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "Comment" ADD COLUMN   "additionalObjectType" "ObjectType";
ALTER TABLE "Comment" ALTER COLUMN "additionalObjectType" TYPE "ObjectType_new" USING ("additionalObjectType"::text::"ObjectType_new");

ALTER TABLE "Like" ADD COLUMN "objectType" "ObjectType";
ALTER TABLE "Like" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "Follow" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "reactions" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TYPE "ObjectType" RENAME TO "ObjectType_old";
ALTER TYPE "ObjectType_new" RENAME TO "ObjectType";
DROP TYPE "ObjectType_old";
ALTER TABLE "Follow" ALTER COLUMN "objectType" SET DEFAULT 'PROJECT';
COMMIT;

-- DropForeignKey
ALTER TABLE "NewsComment" DROP CONSTRAINT "NewsComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "collaboration_comments_responses" DROP CONSTRAINT "collaboration_comments_responses_commentId_fkey";

-- DropIndex
DROP INDEX "Like_projectId_likedBy_key";


UPDATE "Comment"
SET "objectId" = '' WHERE "objectId" IS NULL;

ALTER TABLE "Comment"
ALTER COLUMN "objectId" SET NOT NULL;

-- DROP COLUMN "objectType",
-- ADD COLUMN     "objectType" "ObjectType" NOT NULL;

-- AlterTable
ALTER TABLE "Like" RENAME COLUMN "projectId" TO "objectId";
ALTER TABLE "Like" ALTER COLUMN "objectId" SET NOT NULL,
ALTER COLUMN "objectType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" RENAME COLUMN "upvotedBy" to "likedBy";

-- DropTable
DROP TABLE "NewsComment";

-- DropTable
DROP TABLE "PostComment";

-- DropTable
DROP TABLE "collaboration_comments";

-- DropTable
DROP TABLE "collaboration_comments_responses";

-- DropTable
DROP TABLE "project_comments";

-- DropEnum
DROP TYPE "CommentType";

-- CreateIndex
CREATE UNIQUE INDEX "Like_objectId_likedBy_key" ON "Like"("objectId", "likedBy");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
