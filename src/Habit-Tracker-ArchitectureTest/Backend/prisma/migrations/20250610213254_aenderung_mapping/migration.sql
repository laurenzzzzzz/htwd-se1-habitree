/*
  Warnings:

  - You are about to drop the `Habit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Habit";

-- CreateTable
CREATE TABLE "habit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("id")
);
