-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "time" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxStreak" INTEGER NOT NULL DEFAULT 0;
