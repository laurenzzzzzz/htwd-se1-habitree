/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date]` on the table `habitEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "habitEntry_habitId_date_key" ON "habitEntry"("habitId", "date");
