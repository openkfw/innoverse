/*
  Warnings:

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
-- BEGIN;

CREATE TYPE "ObjectType_new" AS ENUM ('UPDATE', 'EVENT', 'COLLABORATION_QUESTION', 'POST', 'PROJECT', 'SURVEY_QUESTION', 'COMMENT', 'COLLABORATION_COMMENT');

-- Comment Table

ALTER TABLE "Comment" DROP COLUMN "upvotedBy",
ADD COLUMN     "additionalObjectId" TEXT,
ADD COLUMN     "anonymous" BOOLEAN,
ADD COLUMN     "objectId" TEXT;

ALTER TABLE "Comment" ADD COLUMN "objectType_new" "ObjectType_new";
UPDATE "Comment"
SET "objectType_new" = 
    CASE
        WHEN "objectType" = 'POST_COMMENT' THEN 'POST'::"ObjectType_new"
        WHEN "objectType" = 'NEWS_COMMENT' THEN 'UPDATE'::"ObjectType_new"
        ELSE "objectType"::text::"ObjectType_new"
    END;

ALTER TABLE "Comment" drop column "objectType";
Alter table "Comment" rename COLUMN "objectType_new" to "objectType";
ALTER TABLE "Comment" ALTER COLUMN "objectType" SET NOT NULL;


ALTER TABLE "Comment" ADD COLUMN   "additionalObjectType" "ObjectType_new";
ALTER TABLE "Comment" ALTER COLUMN "additionalObjectType" TYPE "ObjectType_new" USING ("additionalObjectType"::text::"ObjectType_new");

UPDATE "Comment" SET "objectId" = nc."newsId" FROM "NewsComment" nc
WHERE nc."commentId" = "Comment"."id";

UPDATE "Comment" SET "objectId" = pc."postId" FROM "PostComment" pc
WHERE pc."commentId" = "Comment"."id";

-- move project comments to comments table
INSERT INTO "Comment" ("id", "createdAt", "updatedAt", "objectType", "objectId", "text", "author") 
SELECT "id", "createdAt", "updatedAt", 'PROJECT'::"ObjectType_new", "projectId", "comment", "author" 
FROM "project_comments";


-- move collaboration comments to comments table
INSERT INTO "Comment" ("id", "createdAt", "updatedAt", "objectType", "objectId", "additionalObjectType", "additionalObjectId", "text", "author", anonymous) 
SELECT "id", "createdAt", "updatedAt", 'PROJECT'::"ObjectType_new", "projectId", 'COLLABORATION_QUESTION'::"ObjectType_new", "questionId", "comment", "author", "visible"
FROM "collaboration_comments";

-- move collaboration comments responses to comments table
INSERT INTO "Comment" ("id", "createdAt", "updatedAt", "objectType", "objectId", "text", "author", "parentId") 
SELECT "collaboration_comments_responses"."id", "collaboration_comments_responses"."createdAt", "collaboration_comments_responses"."updatedAt", 'PROJECT'::"ObjectType_new", "collaboration_comments"."projectId", "collaboration_comments_responses"."response", "collaboration_comments_responses"."author", "collaboration_comments_responses"."commentId"
FROM "collaboration_comments_responses" JOIN "collaboration_comments" ON "collaboration_comments_responses"."commentId" = "collaboration_comments"."id";

-- ALTER TABLE "Like"
ALTER TABLE "Like" ADD COLUMN "objectType" "ObjectType";
ALTER TABLE "Like" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");

-- CreateTable CommentLike
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" TEXT,
    "likedBy" TEXT NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- ALTER TABLE "Follow"
ALTER TABLE "Follow" ADD COLUMN "objectType_new" "ObjectType_new";
UPDATE "Follow"
SET "objectType_new" = 
    CASE
        WHEN "objectType" = 'COLLABORATION_COMMENT' THEN 'COMMENT'::"ObjectType_new"
        WHEN "objectType" = 'POST' THEN 'POST'::"ObjectType_new"
        WHEN "objectType" = 'UPDATE' THEN 'UPDATE'::"ObjectType_new"
        WHEN "objectType" = 'EVENT' THEN 'EVENT'::"ObjectType_new"
        WHEN "objectType" = 'COLLABORATION_QUESTION' THEN 'COLLABORATION_QUESTION'::"ObjectType_new"
        WHEN "objectType" = 'PROJECT' THEN 'PROJECT'::"ObjectType_new"
        WHEN "objectType" = 'SURVEY_QUESTION' THEN 'SURVEY_QUESTION'::"ObjectType_new"
    END;
ALTER TABLE "Follow" DROP COLUMN "objectType";
Alter table "Follow" rename COLUMN "objectType_new" to "objectType";
ALTER TABLE "Follow" ALTER COLUMN "objectType" SET NOT NULL;
ALTER TABLE "Follow" ALTER COLUMN "objectType" SET DEFAULT 'PROJECT';

-- ALTER TABLE "reactions"
ALTER TABLE "reactions" ADD COLUMN "objectType_new" "ObjectType_new";
UPDATE "reactions"
SET "objectType_new" = 
    CASE
        WHEN "objectType" = 'COLLABORATION_COMMENT' THEN 'COMMENT'::"ObjectType_new"
        WHEN "objectType" = 'POST' THEN 'POST'::"ObjectType_new"
        WHEN "objectType" = 'UPDATE' THEN 'UPDATE'::"ObjectType_new"
        WHEN "objectType" = 'EVENT' THEN 'EVENT'::"ObjectType_new"
        WHEN "objectType" = 'COLLABORATION_QUESTION' THEN 'COLLABORATION_QUESTION'::"ObjectType_new"
        WHEN "objectType" = 'PROJECT' THEN 'PROJECT'::"ObjectType_new"
        WHEN "objectType" = 'SURVEY_QUESTION' THEN 'SURVEY_QUESTION'::"ObjectType_new"
    END;
ALTER TABLE "reactions" DROP COLUMN "objectType";
Alter table "reactions" rename COLUMN "objectType_new" to "objectType";
ALTER TABLE "reactions" ALTER COLUMN "objectType" SET NOT NULL;


-- Rename ObjectType
ALTER TYPE "ObjectType" RENAME TO "ObjectType_old";
ALTER TYPE "ObjectType_new" RENAME TO "ObjectType";
DROP TYPE "ObjectType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "NewsComment" DROP CONSTRAINT "NewsComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "collaboration_comments_responses" DROP CONSTRAINT "collaboration_comments_responses_commentId_fkey";

-- DropIndex
DROP INDEX "Like_projectId_likedBy_key";

UPDATE "Comment" SET "objectId" = '' WHERE "objectId" IS NULL;

ALTER TABLE "Comment" ALTER COLUMN "objectId" SET NOT NULL;

-- AlterTable

ALTER TABLE "Like" RENAME COLUMN "projectId" TO "objectId";
UPDATE "Like" SET "objectType" = 'PROJECT' WHERE "objectType" IS NULL;
ALTER TABLE "Like" ALTER COLUMN "objectId" SET NOT NULL;
ALTER TABLE "Like" ALTER COLUMN "objectType" SET NOT NULL;

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
CREATE UNIQUE INDEX "CommentLike_commentId_likedBy_key" ON "CommentLike"("likedBy", "commentId");

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Like_objectId_likedBy_key" ON "Like"("objectId", "likedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_objectId_objectType_followedBy_key" ON "Follow"("objectId", "objectType", "followedBy");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_reactedBy_objectId_objectType_key" ON "reactions"("reactedBy", "objectId", "objectType");