-- CreateTable
CREATE TABLE "UserReactionOnUpdate" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactedBy" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,
    "reactionShortCode" TEXT NOT NULL,

    CONSTRAINT "UserReactionOnUpdate_pkey" PRIMARY KEY ("reactedBy","updateId")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "shortCode" TEXT NOT NULL,
    "nativeSymbol" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("shortCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_shortCode_key" ON "Reaction"("shortCode");

-- AddForeignKey
ALTER TABLE "UserReactionOnUpdate" ADD CONSTRAINT "UserReactionOnUpdate_reactionShortCode_fkey" FOREIGN KEY ("reactionShortCode") REFERENCES "Reaction"("shortCode") ON DELETE RESTRICT ON UPDATE CASCADE;
