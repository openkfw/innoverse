-- CreateTable
CREATE TABLE "UserReactionOnEvent" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactedBy" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "reactionShortCode" TEXT NOT NULL,

    CONSTRAINT "UserReactionOnEvent_pkey" PRIMARY KEY ("reactedBy","eventId")
);

-- AddForeignKey
ALTER TABLE "UserReactionOnEvent" ADD CONSTRAINT "UserReactionOnEvent_reactionShortCode_fkey" FOREIGN KEY ("reactionShortCode") REFERENCES "Reaction"("shortCode") ON DELETE RESTRICT ON UPDATE CASCADE;
