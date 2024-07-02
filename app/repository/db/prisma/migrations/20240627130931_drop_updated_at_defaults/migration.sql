-- AlterTable
ALTER TABLE "collaboration_comments" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "collaboration_comments_responses" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "project_comments" ALTER COLUMN "updatedAt" DROP DEFAULT;
