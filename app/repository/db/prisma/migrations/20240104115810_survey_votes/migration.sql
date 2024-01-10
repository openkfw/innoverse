-- CreateTable
CREATE TABLE "survey_votes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "surveyQuestionId" TEXT NOT NULL,
    "votedBy" TEXT NOT NULL,

    CONSTRAINT "survey_votes_pkey" PRIMARY KEY ("id")
);
