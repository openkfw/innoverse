/*
  Warnings:

  - The values [COLLABORATION_COMMENT] on the enum `ObjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ObjectType_new" AS ENUM ('UPDATE', 'EVENT', 'COLLABORATION_QUESTION', 'POST', 'PROJECT', 'SURVEY_QUESTION', 'COMMENT');
ALTER TABLE "Follow" ALTER COLUMN "objectType" DROP DEFAULT;
ALTER TABLE "Comment" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "Comment" ALTER COLUMN "additionalObjectType" TYPE "ObjectType_new" USING ("additionalObjectType"::text::"ObjectType_new");
ALTER TABLE "ObjectLike" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "Follow" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TABLE "reactions" ALTER COLUMN "objectType" TYPE "ObjectType_new" USING ("objectType"::text::"ObjectType_new");
ALTER TYPE "ObjectType" RENAME TO "ObjectType_old";
ALTER TYPE "ObjectType_new" RENAME TO "ObjectType";
DROP TYPE "ObjectType_old";
ALTER TABLE "Follow" ALTER COLUMN "objectType" SET DEFAULT 'PROJECT';
COMMIT;
