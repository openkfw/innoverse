-- DropForeignKey
ALTER TABLE "collaboration_comments_responses" DROP CONSTRAINT "collaboration_comments_responses_commentId_fkey";

-- AddForeignKey
ALTER TABLE "collaboration_comments_responses" ADD CONSTRAINT "collaboration_comments_responses_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "collaboration_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
