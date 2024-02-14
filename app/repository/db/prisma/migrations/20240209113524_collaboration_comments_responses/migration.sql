-- CreateTable
CREATE TABLE "collaboration_comments_responses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "upvotedBy" TEXT[],
    "commentId" TEXT NOT NULL,

    CONSTRAINT "collaboration_comments_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collaboration_comments_responses" ADD CONSTRAINT "collaboration_comments_responses_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "collaboration_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
