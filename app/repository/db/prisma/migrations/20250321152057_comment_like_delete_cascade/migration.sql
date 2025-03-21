/*
  Warnings:

  - Made the column `commentId` on table `CommentLike` required. This step will fail if there are existing NULL values in that column.

*/

-- Delete commentLikes where commentId is null
DELETE FROM "CommentLike" WHERE "commentId" IS NULL;

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- AlterTable
ALTER TABLE "CommentLike" ALTER COLUMN "commentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ObjectLike" RENAME CONSTRAINT "Like_pkey" TO "ObjectLike_pkey";

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "CommentLike_commentId_likedBy_key" RENAME TO "CommentLike_likedBy_commentId_key";
