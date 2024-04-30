/*
  Warnings:

  - A unique constraint covering the columns `[projectId,followedBy]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,likedBy]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Follow_projectId_followedBy_key" ON "Follow"("projectId", "followedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Like_projectId_likedBy_key" ON "Like"("projectId", "likedBy");
