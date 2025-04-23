-- CreateTable
CREATE TABLE "CheckinVote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredOn" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote" INTEGER NOT NULL,
    "checkinQuestionId" TEXT NOT NULL,
    "votedBy" TEXT NOT NULL,

    CONSTRAINT "CheckinVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckinVote_votedBy_checkinQuestionId_answeredOn_key" ON "CheckinVote"("votedBy", "checkinQuestionId", "answeredOn");
