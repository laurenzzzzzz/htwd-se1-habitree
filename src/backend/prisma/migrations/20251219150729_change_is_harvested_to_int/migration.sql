/*
  Warnings:

  - The `isHarvested` column on the `habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "habit" DROP COLUMN "isHarvested",
ADD COLUMN     "isHarvested" INTEGER NOT NULL DEFAULT 0;
