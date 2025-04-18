/*
  Warnings:

  - A unique constraint covering the columns `[votedBy,checkinQuestionId,createdAt]` on the table `CheckinVote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CheckinVote_votedBy_checkinQuestionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CheckinVote_votedBy_checkinQuestionId_createdAt_key" ON "CheckinVote"("votedBy", "checkinQuestionId", "createdAt");
