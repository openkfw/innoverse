-- CreateTable
CREATE TABLE "EmailPreferences" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "weeklyEmail" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "EmailPreferences_pkey" PRIMARY KEY ("userId")
);
