-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "weekDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
