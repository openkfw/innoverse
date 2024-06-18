/*
  Warnings:

  - Added the required column `updatedAt` to the `collaboration_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `collaboration_comments_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `project_comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collaboration_comments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "collaboration_comments_responses" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "project_comments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

